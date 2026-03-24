import express from 'express';
import { listingRouter } from './modules/listing/listing.route';
import cors from 'cors';
import { logger } from './utils/logger';
import helmet from 'helmet';
import errorMiddleware from './middlewares/error.middleware';

const app = express();

declare global {
    namespace Express {
        interface Request {
            user?: {
                is_admin: boolean;
            }
        }
    }
}


const rawOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean);

const corsOrigins = rawOrigins && rawOrigins.length > 0 ? rawOrigins : false;

if (!rawOrigins?.length && process.env.NODE_ENV === 'production') {
    logger.warn('CORS_ORIGIN is unset — browsers will be blocked by CORS (origin: false)');
}


app.use(helmet());
app.use(express.json({ limit: '1mb' }));

var corsOptions = {
    origin: corsOrigins,
    optionsSuccessStatus: 200,
    credentials: true,
}

app.use(cors(corsOptions));


app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use("/listings", listingRouter)


app.use(errorMiddleware)



export default app;