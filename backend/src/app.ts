import express from 'express';
import { listingRouter } from './modules/listing/listing.route';
import cors from 'cors';

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

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json());
app.use(cors(corsOptions));

app.get("/test", (req, res) => {
    res.send("Hello World");
});

app.use("/listings", listingRouter)

export default app;