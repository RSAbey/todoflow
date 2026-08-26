const path = require('path');
const dotenv = require('dotenv');

/**
 * Load backend environment files from the backend package root
 * (not process.cwd), so workspace/root launches still work.
 *
 * Order:
 * 1. .env
 * 2. .env.local (overrides .env when both exist)
 *
 * Real secret files stay local and gitignored; commit only .env.example.
 */
function loadEnv() {
  const backendRoot = path.join(__dirname, '../..');

  dotenv.config({ path: path.join(backendRoot, '.env') });
  dotenv.config({
    path: path.join(backendRoot, '.env.local'),
    override: true,
  });
}

module.exports = {
  loadEnv,
};
