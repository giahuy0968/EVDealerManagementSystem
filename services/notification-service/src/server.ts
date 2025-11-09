import { logger } from './utils/logger';
import NotificationServiceApp from './app';

async function startServer(): Promise<void> {
  try {
    const app = new NotificationServiceApp();
    await app.start();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

export { startServer };
