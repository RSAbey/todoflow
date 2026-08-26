/**
 * Controlled API smoke test against a running local backend.
 * Cleans up temporary tasks afterward. Never prints secrets.
 */
const base = process.env.API_BASE || 'http://localhost:5000/api';
const marker = `tf-review-${Date.now()}`;

async function req(method, path, body) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json().catch(() => null);
  return { status: response.status, json };
}

async function main() {
  const health = await req('GET', '/health');
  if (health.status !== 200 || !health.json?.success) {
    console.log('SMOKE=FAIL');
    process.exit(1);
  }

  const created = await req('POST', '/tasks', {
    title: marker,
    description: 'review smoke',
    priority: 'low',
  });
  if (created.status !== 201 || !created.json?.data?._id) {
    console.log('SMOKE=FAIL');
    process.exit(1);
  }
  const id = created.json.data._id;

  const listed = await req('GET', '/tasks?status=all');
  const active = await req('GET', '/tasks?status=active');
  const completedFalse = await req('GET', '/tasks?completed=false');
  const updated = await req('PUT', `/tasks/${id}`, {
    title: `${marker}-upd`,
    priority: 'high',
  });
  const toggled = await req('PATCH', `/tasks/${id}/complete`);
  const completedTrue = await req('GET', '/tasks?completed=true');
  const badUpdate = await req('PUT', `/tasks/${id}`, {
    title: 'x',
    completed: true,
  });
  const deleted = await req('DELETE', `/tasks/${id}`);

  const createdDone = await req('POST', '/tasks', { title: `${marker}-done` });
  const id2 = createdDone.json?.data?._id;
  if (!id2) {
    console.log('SMOKE=FAIL');
    process.exit(1);
  }
  await req('PATCH', `/tasks/${id2}/complete`);
  const cleared = await req('DELETE', '/tasks/completed');
  const gone = await req('GET', `/tasks/${id2}`);

  // Cleanup any leftover marker tasks (best effort)
  const all = await req('GET', '/tasks?status=all');
  const leftovers = (all.json?.data?.tasks || []).filter((task) =>
    String(task.title || '').startsWith(marker),
  );
  for (const task of leftovers) {
    await req('DELETE', `/tasks/${task._id}`);
  }

  const ok =
    listed.json?.success &&
    active.json?.success &&
    completedFalse.json?.success &&
    updated.json?.data?.priority === 'high' &&
    toggled.json?.data?.completed === true &&
    completedTrue.json?.success &&
    badUpdate.status === 400 &&
    deleted.json?.data?.deleted === true &&
    cleared.json?.success &&
    typeof cleared.json?.data?.deletedCount === 'number' &&
    gone.status === 404;

  console.log(ok ? 'SMOKE=PASS' : 'SMOKE=FAIL');
  process.exit(ok ? 0 : 1);
}

main().catch(() => {
  console.log('SMOKE=FAIL');
  process.exit(1);
});
