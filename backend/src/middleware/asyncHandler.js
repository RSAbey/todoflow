/**
 * Wraps async route/controller handlers so rejected promises
 * are forwarded to Express error middleware.
 */
function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
