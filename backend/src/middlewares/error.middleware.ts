import { Request, Response, NextFunction } from "express";

import { logger } from "../utils/logger";


export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(status).json({
        message: 'Internal server error',
    });
}

export default errorMiddleware;