import { z } from 'zod';

export const listingQuerySchema = z.object({
    search: z.string().optional(),
    suburb: z.string().optional(),
    min_price: z.coerce.number().optional(),
    max_price: z.coerce.number().optional(),
    beds: z.coerce.number().optional(),
    baths: z.coerce.number().optional(),
    property_type: z.string().optional(),
    limit: z.coerce.number().default(10),
    offset: z.coerce.number().default(0),
    sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc']).default('newest'),
}).superRefine((data, ctx) => {
          
    if (data.min_price && data.max_price && data.min_price > data.max_price) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Min price must be less than max price',
        });
    }
});

export type ListingQuery = z.infer<typeof listingQuerySchema>;