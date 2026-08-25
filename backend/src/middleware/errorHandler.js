/**
 * Minimal central error-handling middleware.
 * Expanded handling (validation, 404 mapping) comes in a later phase.
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? 'Internal server error' : err.message || 'Request failed';

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      message,
    },
  });
}

module.exports = errorHandler;
