import { logger } from './utils/logger';
import AuthServiceApp from './app';

async function startServer(): Promise<void> {
  try {
    const authApp = new AuthServiceApp();
    await authApp.start();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export { startServer };