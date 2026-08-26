const { loadEnv } = require('./config/env');

loadEnv();

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`TodoFlow backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start TodoFlow backend:', err.message);
    process.exit(1);
  }
}

startServer();
