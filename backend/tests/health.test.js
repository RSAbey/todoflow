const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('returns 200 and confirms the backend is running', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        service: 'TodoFlow API',
        status: 'ok',
        message: 'TodoFlow backend is running',
      },
      error: null,
    });
  });
});
