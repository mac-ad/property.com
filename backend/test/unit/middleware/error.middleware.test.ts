

jest.mock('../../../src/utils/logger', () => ({
    logger: {
        error: jest.fn(),
    }
}))


import { Request, Response, NextFunction } from 'express';
import { errorMiddleware } from '../../../src/middlewares/error.middleware';
import { logger } from '../../../src/utils/logger';

describe('errorMiddleware', () => {
    it('responds with 500 and generic JSON body', () => {
        const err = new Error('something failed');
        const req = {} as Request;
        const res = {} as Response;
        res.statusCode = 200;
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnThis();
        const next = jest.fn() as NextFunction;

        errorMiddleware(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Internal server error',
        });
        expect(next).not.toHaveBeenCalled();
    })

    it('responds with the status code of the response if it is not 200', () => {
        const err = new Error('something failed');
        const req = {} as Request;
        const res = {} as Response;
        res.statusCode = 404;
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnThis();
        const next = jest.fn() as NextFunction;

        errorMiddleware(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Internal server error',
        });
        expect(next).not.toHaveBeenCalled();
    })

    it('logs the error', () => {
        const err = new Error('something failed');
        const req = {} as Request;
        const res = {} as Response;
        res.statusCode = 200;
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnThis();
        const next = jest.fn() as NextFunction;

        errorMiddleware(err, req, res, next);

        expect(logger.error).toHaveBeenCalledWith(err);
    })
})