import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config({
    quiet: true
});

const getDatabaseUrl = () => {
    return process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL
}

if (!getDatabaseUrl()) {
    logger.error('DATABASE_URL is not set');
    process.exit(1);
}

export const pool = new Pool({
    connectionString: getDatabaseUrl(),
    max: Number(process.env.PG_POOL_MAX) || 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,

    ssl: process.env.DATABASE_SSL === 'true'
        ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' }
        : undefined,
})

export const connectDB = async () => {
    try {
        await pool.query('SELECT 1')
        logger.info("DB Connected Successfully!")
    } catch (error) {
        logger.error("DB Connection Error!");
        logger.error(error);
        throw error;
    }
}