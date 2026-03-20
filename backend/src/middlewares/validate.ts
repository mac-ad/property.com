import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { TypedRequest } from "../types/common";


export const validateQuery = <T>(schema: ZodSchema<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.query);

        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid query parameters',
                errors: result.error.flatten(),
            });
        }

        // replace req.query with validated data
        (req as TypedRequest<T>).parsedQuery = result.data;


        next();
    }
}