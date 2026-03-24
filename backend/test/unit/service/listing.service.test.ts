jest.mock('../../../src/db', () => ({
    pool: {
        query: jest.fn()
    }
}));

import { pool } from "../../../src/db";


import * as listingService from "../../../src/modules/listing/listing.service";

const mockQuery = pool.query as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
});

describe('listing.service - getSuburbs', () => {
    it('should return array of suburb strings', async () => {
        mockQuery.mockResolvedValue({
            rows: [{ suburb: 'CBD' }, { suburb: 'Bondi' }],
        });

        const result = await listingService.getSuburbs();

        expect(result).toEqual(['CBD', 'Bondi']);
        expect(mockQuery).toHaveBeenCalledWith("SELECT DISTINCT suburb FROM properties");
    })

    it('should return empty array if no suburbs found', async () => {
        mockQuery.mockResolvedValue({ rows: [] });

        const result = await listingService.getSuburbs();

        expect(result).toEqual([])
    })


    it('should propagate database errors', async () => {
        mockQuery.mockRejectedValue(new Error('connection refused'));

        await expect(listingService.getSuburbs()).rejects.toThrow('connection refused');
    });
})

describe('listing.service - getPropertyTypes', () => {
    it('should return array of property type strings', async () => {
        mockQuery.mockResolvedValue({
            rows: [{ property_type: 'apartment' }, { property_type: 'house' }],
        });

        const result = await listingService.getPropertyTypes();

        expect(mockQuery).toHaveBeenCalledWith("SELECT DISTINCT property_type FROM properties");
        expect(result).toEqual(['apartment', 'house']);
    });

    it('should return empty array when no property types exist', async () => {
        mockQuery.mockResolvedValue({ rows: [] });

        const result = await listingService.getPropertyTypes();

        expect(result).toEqual([]);
    });

    it('should propagate database errors', async () => {
        mockQuery.mockRejectedValue(new Error('connection refused'));

        await expect(listingService.getPropertyTypes()).rejects.toThrow('connection refused');
    });
});

describe('listing.service - getListingsBySlugOrId', () => {

    it('should query by Id when ideentifier is numeric', async () => {
        mockQuery.mockResolvedValue({
            rows: [{ id: 1, title: 'Test' }]
        });

        await listingService.getListingBySlugOrId('42', false);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('WHERE id = $1'),
            [42]
        )
    })

    it('should query by slug when identifier is not numeric', async () => {
        mockQuery.mockResolvedValue({
            rows: [{ id: 1, title: 'Test' }]
        })

        await listingService.getListingBySlugOrId('test-slug', false);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('WHERE slug = $1'),
            ['test-slug']
        )
    })

    it('should select all columns from admin users', async () => {
        mockQuery.mockResolvedValue({ rows: [{}] });

        await listingService.getListingBySlugOrId('test-slug', true);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT *'),
            expect.anything()
        )
    })

    it('should exclude internal fields for non-admin users', async () => {
        mockQuery.mockResolvedValue({ rows: [{}] });

        await listingService.getListingBySlugOrId('1', false);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.not.stringContaining('*'),
            expect.anything()
        );
    });

    it('should return undefined when no rows match', async () => {
        mockQuery.mockResolvedValue({ rows: [] })

        const result = await listingService.getListingBySlugOrId('333', false);

        expect(result).toBeUndefined();
    })

    it('should propagate database errors', async () => {
        mockQuery.mockRejectedValue(new Error('connection refused'));

        await expect(listingService.getListingBySlugOrId('333', false))
            .rejects.toThrow('connection refused');
    })
})

describe('listing.service - getListings', () => {
    const buildReq = (overrides?: Record<string, any>) => ({
        parsedQuery: {
            limit: 10,
            offset: 0,
            sort: undefined,
            ...overrides
        },
        user: { is_admin: overrides?.is_admin ?? false }
    } as any);

    const mockRows = [
        { id: 1, title: 'Test-Listing-1', price: 500 },
        { id: 2, title: 'Test-Listing-2', price: 600 },
    ]

    const setupMocks = (dataRows = mockRows, count = dataRows.length) => {
        mockQuery
            .mockResolvedValueOnce({ rows: dataRows })
            .mockResolvedValueOnce({ rows: [{ count: String(count) }] })
    }


    it('should return data and total count', async () => {
        setupMocks();

        const { parsedQuery, user } = buildReq();

        const result = await listingService.getListings(parsedQuery, user?.is_admin ?? false);

        expect(result.data).toEqual(mockRows)
        expect(result.total).toBe(mockRows.length)
    })

    it('should execute a * data query and a count query for is_admin true user', async () => {
        setupMocks();
        const { parsedQuery, user } = buildReq({
            is_admin: true,
        });

        await listingService.getListings(parsedQuery, user?.is_admin ?? false);

        expect(mockQuery).toHaveBeenCalledTimes(2);
        expect(mockQuery).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT * FROM properties'), expect.anything());
        expect(mockQuery).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT COUNT(*) FROM properties'), expect.anything());
    });
})