function createHttpError(statusCode, message, code = 'REQUEST_ERROR') {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

module.exports = {
  createHttpError,
};
