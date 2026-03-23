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


beforeEach(() => {
    jest.clearAllMocks();
});


describe('listing.controller - getSuburbs error handling', () => {
    it('should return 500 when service throws', async () => {
        (listingService.getSuburbs as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = {} as Request;
        const res = mockRes();
        await listingController.getSuburbs(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Internal server error',
        });
    });
});


describe('listing.controller - getPropertyTypes error handling', () => {
    it('should return 500 when service throws', async () => {
        (listingService.getPropertyTypes as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = {} as Request;
        const res = mockRes();
        await listingController.getPropertyTypes(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});


describe('listing.controller - getListingBySlugOrId error handling', () => {
    it('should return 500 when service throws', async () => {
        (listingService.getListingBySlugOrId as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = { params: { identifier: 'test-slug' }, user: { is_admin: false } } as any;
        const res = mockRes();
        await listingController.getListingBySlugOrId(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
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
        await listingController.getListings(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});
