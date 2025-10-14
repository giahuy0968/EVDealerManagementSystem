import { sequelize } from '../src/config/database';

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
}

check();
