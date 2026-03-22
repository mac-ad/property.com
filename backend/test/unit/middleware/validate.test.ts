import { Response, Request, NextFunction } from "express"
import { validateQuery } from "../../../src/middlewares/validate";
import { listingQuerySchema } from "../../../src/modules/listing/listing.schema";


describe('validateQuery middleware', () => {
    const mockNext: NextFunction = jest.fn();
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    const createMockRes = (): Partial<Response> => ({
        status: mockStatus as any,
        json: mockJson
    })

    afterEach(() => jest.clearAllMocks());

    it('should call next() and set parsedQuery when query is valid', () => {
        const req = {
            query: {
                limit: '10',
                offset: '0',
                sort: 'newest'
            }
        } as any;

        const res = createMockRes() as Response;

        validateQuery(listingQuerySchema)(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(req.parsedQuery).toBeDefined();
        expect(req.parsedQuery.limit).toBe(10);
        expect(req.parsedQuery.offset).toBe(0);
        expect(req.parsedQuery.sort).toBe('newest');
    })

    it('should return 400 on invalid input', () => {
        const req = {
            query: {
                sort: 'invalid_sort'
            }
        } as any;

        const res = createMockRes() as Response;

        validateQuery(listingQuerySchema)(req, res, mockNext);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Invalid query parameters' })
        );
        expect(mockNext).not.toHaveBeenCalled();
    })
})