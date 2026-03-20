import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

if (!process.env.DATABASE_URL) {
    logger.error('DATABASE_URL is not set');
    process.exit(1);
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
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