import { execSync } from 'child_process';
import { logger } from '../../src/utils/logger';
import { pool } from '../../src/db';
import { seed } from '../../scripts/seed';

export const setupTestDB = async () => {
    try {
        execSync('npx dotenv -e .env -- node-pg-migrate down -d TEST_DATABASE_URL');
        execSync('npx dotenv -e .env -- node-pg-migrate up -d TEST_DATABASE_URL');
        logger.info('Test database setup complete');
    } catch (error) {
        logger.error('Error setting up test database');
        logger.error(error);
        throw error;
    }
}

export const cleanTestData = async () => {
    await pool.query('DELETE FROM properties');
    await pool.query('DELETE FROM agents');
}

export const seedTestDbData = async () => {
    await seed(false);
}

export const teardownTestDb = async () => {
    await pool.end();
}