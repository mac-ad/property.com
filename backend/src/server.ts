import app from './app';
import { connectDB } from './db';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        logger.error('Server startup aborted due to DB failure');
        logger.error(error);
        process.exit(1);
    }
}

startServer();