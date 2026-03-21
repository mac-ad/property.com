export type Listing = {
    id: number;
    title: string;
    price: number;
    beds: number;
    baths: number;
    property_type: string;
    suburb: string;
    slug: string;
    image: string;
    internal_notes?: string;
    created_at: string;
};

export type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc';

export type ListingsQuery = {
    search?: string;
    suburb?: string;
    min_price?: number;
    max_price?: number;
    beds?: number;
    baths?: number;
    property_type?: string;
    keyword?: string;
    limit?: number;
    offset?: number;
    sort?: SortOption;
};

export type ListingsMetaData = {
    total: number;
    offset: number;
    limit: number;
};

export type ListingsResponse = {
    data: Listing[];
    metaData: ListingsMetaData;
};
