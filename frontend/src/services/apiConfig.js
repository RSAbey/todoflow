const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

/**
 * Resolve the TodoFlow API base URL from Vite env.
 * Trailing slashes are stripped so callers can join `/tasks` safely.
 */
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;

  if (typeof configured === 'string' && configured.trim()) {
    return configured.trim().replace(/\/+$/, '');
  }

  return DEFAULT_API_BASE_URL;
}
