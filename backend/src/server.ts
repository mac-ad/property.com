import app from './app';
import { connectDB, pool } from './db';
import { logger } from './utils/logger';

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        })


        const shutdown = (signal: string) => {
            logger.info({ signal }, 'Shutdown requested');
            server.close((err) => {
                if (err) logger.error(err);

                pool.end(() => {
                    logger.info('DB connection closed');
                    process.exit(err ? 1 : 0);
                })
            })
        }

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (error) {
        logger.error('Server startup aborted due to DB failure');
        logger.error(error);
        process.exit(1);
    }
}

startServer();