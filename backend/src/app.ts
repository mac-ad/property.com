import express from 'express';
import { listingRouter } from './modules/listing/listing.route';

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

app.use(express.json());

app.get("/test", (req, res) => {
    res.send("Hello World");
});

app.use("/listings", listingRouter)

export default app;