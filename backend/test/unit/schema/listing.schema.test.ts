import { listingQuerySchema } from "../../../src/modules/listing/listing.schema";


describe('listingQuerySchema', () => {
    it('should pass with no params (default values)', () => {
        const result = listingQuerySchema.safeParse({});
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.limit).toBe(10);
            expect(result.data.offset).toBe(0);
            expect(result.data.sort).toBe('newest');
        }
    })

    it('should coerce string numbers to numbers', () => {
        const result = listingQuerySchema.safeParse({
            min_price: '100000',
            max_price: '500000',
            beds: '3',
            baths: '2',
            limit: '20',
            offset: '5',
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.min_price).toBe(100000);
            expect(result.data.max_price).toBe(500000);
            expect(result.data.beds).toBe(3);
            expect(result.data.baths).toBe(2);
        }
    })

    it('should fail when min_price > max_price', () => {
        const result = listingQuerySchema.safeParse({
            min_price: 500000,
            max_price: 100000,
        });
        expect(result.success).toBe(false);
    });

    it('should accept valid sort values', () => {
        for (const sort of ['newest', 'oldest', 'price_asc', 'price_desc']) {
            const result = listingQuerySchema.safeParse({ sort });
            expect(result.success).toBe(true);
        }
    });

    it('should reject invalid sort values', () => {
        const result = listingQuerySchema.safeParse({ sort: 'invalid' });
        expect(result.success).toBe(false);
    });
})