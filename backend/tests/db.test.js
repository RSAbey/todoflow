const { connectDB } = require('../src/config/db');

describe('connectDB', () => {
  const originalUri = process.env.MONGODB_URI;

  afterEach(() => {
    if (originalUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalUri;
    }
  });

  it('fails clearly when MONGODB_URI is missing', async () => {
    delete process.env.MONGODB_URI;

    await expect(connectDB()).rejects.toThrow(/MONGODB_URI is missing/);
  });

  it('fails clearly when MONGODB_URI is blank', async () => {
    await expect(connectDB('   ')).rejects.toThrow(/MONGODB_URI is missing/);
  });
});

describe('Express app import', () => {
  it('can be required without an active MongoDB connection', () => {
    jest.resetModules();
    delete process.env.MONGODB_URI;

    expect(() => require('../src/app')).not.toThrow();
  });
});
