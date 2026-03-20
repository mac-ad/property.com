// src/modules/listings/listings.types.ts

export type Listing = {
    id: number;
    title: string;
    price: number;
    beds: number;
    baths: number;
    property_type: string;
    suburb: string;
    agent_id: number;
    internal_notes?: string | null;
    created_at: string;
};
