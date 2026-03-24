jest.mock('../../../src/db', () => ({
    pool: { query: jest.fn() }
}));

jest.mock('../../../src/modules/listing/listing.service');

jest.mock('../../../src/utils/logger', () => ({
    logger: {
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    },
}));

import { Request, Response } from 'express';
import * as listingController from '../../../src/modules/listing/listing.controller';
import * as listingService from '../../../src/modules/listing/listing.service';

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
};

const mockNext = () => {
    const next = jest.fn();
    return next;
}


beforeEach(() => {
    jest.clearAllMocks();
});


describe('listing.controller - getSuburbs error handling', () => {
    it('should return 500 when service throws', async () => {
        (listingService.getSuburbs as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = {} as Request;
        const res = mockRes();
        const next = mockNext();

        await listingController.getSuburbs(req, res, next);
        // expect(res.status).toHaveBeenCalledWith(500);
        // expect(res.json).toHaveBeenCalledWith({
        //     message: 'Internal server error',
        // });
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new Error('DB error'))
        expect(res.status).not.toHaveBeenCalled();
    });
});


describe('listing.controller - getPropertyTypes error handling', () => {
    it('should return 500 when service throws', async () => {
        (listingService.getPropertyTypes as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = {} as Request;
        const res = mockRes();
        const next = mockNext();

        await listingController.getPropertyTypes(req, res, next);
        // expect(res.status).toHaveBeenCalledWith(500);
        // expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new Error('DB error'))
        expect(res.status).not.toHaveBeenCalled();
    });
});


describe('listing.controller - getListingBySlugOrId error handling', () => {
    it('should return 500 when service throws', async () => {
        (listingService.getListingBySlugOrId as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = { params: { identifier: 'test-slug' }, user: { is_admin: false } } as any;
        const res = mockRes();
        const next = mockNext();
        await listingController.getListingBySlugOrId(req, res, next);
        // expect(res.status).toHaveBeenCalledWith(500);
        // expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new Error('DB error'))
        expect(res.status).not.toHaveBeenCalled();
    });
});


describe('listing.controller - getListings error handling', () => {
    it('should return 500 when service throws', async () => {
        (listingService.getListings as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = {
            parsedQuery: { limit: 10, offset: 0 },
            user: { is_admin: false }
        } as any;
        const res = mockRes();
        const next = mockNext();
        await listingController.getListings(req, res, next);
        // expect(res.status).toHaveBeenCalledWith(500);
        // expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new Error('DB error'))
        expect(res.status).not.toHaveBeenCalled();
    });
});
