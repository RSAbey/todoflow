/**
 * Central error-handling middleware.
 * Maps known application/Mongoose errors to safe client responses.
 */
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let code = err.code || (statusCode === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');
  let message = err.message || 'Request failed';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = Object.values(err.errors || {})
      .map((entry) => entry.message)
      .filter(Boolean)
      .join(', ') || 'Validation failed';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    if (err.path === '_id') {
      code = 'INVALID_ID';
      message = 'Invalid task id';
    } else {
      code = 'VALIDATION_ERROR';
      message = err.path
        ? `Invalid value for ${err.path}`
        : 'Invalid value';
    }
  }

  if (statusCode === 500) {
    message = 'Internal server error';
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code,
      message,
    },
  });
}

module.exports = errorHandler;
