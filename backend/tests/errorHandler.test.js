const errorHandler = require('../src/middleware/errorHandler');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler', () => {
  it('maps ObjectId CastError to INVALID_ID', () => {
    const err = new Error('cast failed');
    err.name = 'CastError';
    err.path = '_id';
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: {
        code: 'INVALID_ID',
        message: 'Invalid task id',
      },
    });
  });

  it('maps field CastError to VALIDATION_ERROR without exposing internals', () => {
    const err = new Error('cast failed for dueDate');
    err.name = 'CastError';
    err.path = 'dueDate';
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid value for dueDate',
      },
    });
  });

  it('hides unexpected error details behind INTERNAL_ERROR', () => {
    const err = new Error('ECONNREFUSED secret-host:27017');
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  });
});
