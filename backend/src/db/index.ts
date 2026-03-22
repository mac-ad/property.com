import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const getDatabaseUrl = () => {
    return process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL
}

if (!getDatabaseUrl()) {
    logger.error('DATABASE_URL is not set');
    process.exit(1);
}

export const pool = new Pool({
    connectionString: getDatabaseUrl()
})

export const connectDB = async () => {
    try {
        await pool.query('SELECT 1')
        logger.info("DB Connected Successfully! 🚀")
    } catch (error) {
        logger.error("DB Connection Error! 🚨");
        logger.error(error);
        throw error;
    }
}