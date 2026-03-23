import request from 'supertest';
import app from '../../../src/app';
import { cleanTestData, seedTestDbData, setupTestDB, teardownTestDb } from '../setup';
import { Listing } from '../../../src/modules/listing/listing.types';

beforeAll(async () => {
    await setupTestDB();
    await seedTestDbData();
})

// beforeEach(async () => {
//     await seedTestDbData();
// })

// afterEach(async () => {
//     await cleanTestData();
// })

afterAll(async () => {
    await cleanTestData();
    await teardownTestDb();
})

describe('GET /listings/suburbs', () => {
    // 200 status code: success
    it('should return a list of distinct suburbs', async () => {
        const res = await request(app).get('/listings/suburbs');

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body).toMatchObject({
            message: 'Suburbs fetched successfully',
            data: expect.arrayContaining([expect.any(String)]),
        });
    })
})

describe('GET /listings/property-types', () => {
    it('should return distinct property types', async () => {
        const res = await request(app).get('/listings/property-types');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            message: 'Property types fetched successfully',
            data: expect.arrayContaining([expect.any(String)]),
        });
    });
})

describe('GET /listings', () => {
    it('should return paginated listings for normal user', async () => {
        const res = await request(app).get('/listings');

        expect(res.status).toBe(200);
        expect(res.body.metaData).toMatchObject({
            total: 40,
            offset: 0,
            limit: 10
        })
        expect(res.body.data).toHaveLength(10);
        expect(res.body).toMatchObject({
            message: 'Listings fetched successfully',
            metaData: expect.objectContaining({
                total: 40,
                offset: 0,
                limit: 10
            }),
            data: expect.arrayContaining([expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String),
                price: expect.any(Number),
                beds: expect.any(Number),
                baths: expect.any(Number),
                property_type: expect.any(String),
                suburb: expect.any(String),
                created_at: expect.any(String),
                slug: expect.any(String),
                image: expect.any(String),
                agent_id: expect.any(Number),
            })])
        })
    })

    it('should return all fields for admin user', async () => {
        const res = await request(app)
            .get('/listings')
            .set('x-email', 'agent@gmail.com');
        expect(res.status).toBe(200);

        expect(res.body.data[0]).toHaveProperty('internal_notes');

        expect(res.body).toMatchObject({
            message: 'Listings fetched successfully',
            metaData: expect.objectContaining({
                total: 40,
                offset: 0,
                limit: 10
            }),
            data: expect.arrayContaining([expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String),
                price: expect.any(Number),
                beds: expect.any(Number),
                baths: expect.any(Number),
                slug: expect.any(String),
                image: expect.any(String),
                property_type: expect.any(String),
                suburb: expect.any(String),
                agent_id: expect.any(Number),
                created_at: expect.any(String),
                internal_notes: expect.any(String),
            })])
        })
    });

    it('should filter by suburb', async () => {

        const query = `?suburb=Tokha`;
        const res = await request(app).get(`/listings${query}`);

        expect(res.status).toBe(200);
        expect(res.body.data.every((item: Listing) => item.suburb === 'Tokha')).toBe(true);
    })

    it('should filter by price range', async () => {
        const query = `?min_price=20000000&max_price=60000000`;
        const res = await request(app).get(`/listings${query}`);
        expect(res.status).toBe(200);
        expect(res.body.data.every((item: Listing) => item.price >= 20000000 && item.price <= 60000000)).toBe(true);
    })

    it('should sort by price ascending', async () => {
        const query = `?sort=price_asc`;
        const res = await request(app).get(`/listings${query}`);
        expect(res.status).toBe(200);
        const prices = res.body.data.map((l: any) => l.price);
        expect(prices).toEqual([...prices].sort((a: number, b: number) => a - b));
    });

    it('should sort by price descending', async () => {
        const query = `?sort=price_desc`;
        const res = await request(app).get(`/listings${query}`);
        expect(res.status).toBe(200);
        const prices = res.body.data.map((l: any) => l.price);
        expect(prices).toEqual([...prices].sort((a: number, b: number) => b - a));
    });

    it('should respect limit and offset', async () => {
        const query = `?limit=2&offset=1`;
        const res = await request(app).get(`/listings${query}`);
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.metaData.total).toBe(40);
        expect(res.body.metaData.offset).toBe(1);
    });

    it('should reject invalid query params min_price > max_price', async () => {
        const query = `?min_price=500000&max_price=100000`;
        const res = await request(app).get(`/listings${query}`);

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
            message: 'Invalid query parameters',
            errors: expect.objectContaining({
                formErrors: ['Min price must be less than max price'],
            }),
        });
    });
})


describe('GET /listings/:identifier', () => {
    it('should return a listing by slug', async () => {
        const res = await request(app).get('/listings/land-for-sale-in-tokha');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            message: 'Listing fetched successfully',
            data: expect.objectContaining({
                title: 'Land for Sale in Tokha',
                price: 12000000
            }),
        });
    })

    it('should fetch listing by numeric id', async () => {
        // first get a valid id
        const res = await request(app).get(`/listings/5`);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body).toMatchObject({
            message: 'Listing fetched successfully',
            data: expect.objectContaining({
                title: 'Land for Sale in Tokha',
                price: 12000000
            }),
        });
    });

    it('should return null data for non-existent slug', async () => {
        const res = await request(app).get('/listings/does-not-exist');
        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({
            message: 'Listing not found',
            data: null,
        });
    });

    it('should hide internal_notes from non-admin users', async () => {
        const res = await request(app).get('/listings/land-for-sale-in-tokha');
        expect(res.body.data).not.toHaveProperty('internal_notes');
    });

    it('should show internal_notes to admin users', async () => {
        const res = await request(app)
            .get('/listings/land-for-sale-in-tokha')
            .set('x-email', 'agent@gmail.com');
        expect(res.body.data).toHaveProperty('internal_notes');
    });

    it('should filter by beds', async () => {
        const query = `?beds=3`;
        const res = await request(app).get(`/listings${query}`);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data.every((item: Listing) => item.beds === 3)).toBe(true);
    });

    it('should filter by baths', async () => {
        const res = await request(app).get('/listings?baths=2');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data.every((item: Listing) => item.baths === 2)).toBe(true);
    });

    it('should filter by property_type', async () => {
        const res = await request(app).get('/listings?property_type=apartment');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data.every((item: Listing) => item.property_type === 'apartment')).toBe(true);
    });

    it('should filter by search', async () => {
        const res = await request(app).get('/listings?search=Land');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data.every((item: Listing) =>
            item.title.toLowerCase().includes('land')
        )).toBe(true);
    });


    it('should sort by oldest', async () => {
        const res = await request(app).get('/listings?sort=oldest');
        expect(res.status).toBe(200);
        const dates = res.body.data.map((l: any) => new Date(l.created_at).getTime());
        expect(dates).toEqual([...dates].sort((a: number, b: number) => a - b));
    });

    it('should combine multiple filters', async () => {
        const res = await request(app).get('/listings?property_type=apartment&beds=3&sort=price_asc');
        expect(res.status).toBe(200);
        expect(res.body.data.every((item: Listing) =>
            item.property_type === 'apartment' && item.beds === 3
        )).toBe(true);
        const prices = res.body.data.map((l: any) => l.price);
        expect(prices).toEqual([...prices].sort((a: number, b: number) => a - b));
    });

})