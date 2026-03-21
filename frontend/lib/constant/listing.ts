
export const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
] as const;

export const FILTER_KEYS = [
    "suburb",
    "min_price",
    "max_price",
    "beds",
    "baths",
    "property_type",
] as const;
