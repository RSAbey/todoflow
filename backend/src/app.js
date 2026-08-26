const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

/**
 * CORS:
 * - If CORS_ORIGIN is set (comma-separated), only those origins are allowed.
 * - In non-production without CORS_ORIGIN, allow local Vite defaults.
 * - In production without CORS_ORIGIN, deny browser cross-origin requests.
 * Requests with no Origin header (curl, Postman, server-to-server) are allowed
 * when an allow-list is configured.
 */
function buildCorsOptions() {
  const configured = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (configured.length > 0) {
    return {
      origin(origin, callback) {
        if (!origin || configured.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
    };
  }

  if (process.env.NODE_ENV === 'production') {
    return { origin: false };
  }

  return {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  };
}

app.use(cors(buildCorsOptions()));
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

module.exports = app;
