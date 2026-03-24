jest.mock('../../../src/utils/logger', () => ({
    logger: {
        error: jest.fn(),
    }
}))


import express from 'express';
import request from 'supertest';
import errorMiddleware from '../../../src/middlewares/error.middleware';
import { logger } from '../../../src/utils/logger';


describe('Express error pipeline', () => {
    it('returns 500 when a route calls next(error)', async () => {
        const app = express();
        app.get('/boom', (_req, _res, next) => {
            next(new Error('forced failure'));
        });
        app.use(errorMiddleware);

        const res = await request(app).get('/boom');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error' });
        expect(logger.error).toHaveBeenCalledWith(new Error('forced failure'));
    });
});