import { ListingsQuery, Listing, ListingsMetaData } from "../types/listings";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchListingBySlug = async (
    slug: string,
    email?: string
): Promise<{ data: Listing | null, error: string | null }> => {
    try {
        const response = await fetch(`${BASE_URL}/listings/${slug}`, {
            headers: {
                "Content-Type": "application/json",
                "X-Email": email || "",
            },
            cache: "no-store",
        });

        if (!response.ok) return { data: null, error: 'Failed to fetch specific listing' };

        const data = await response.json();

        return {
            data: (data.data as Listing) ?? null,
            error: null,
        };
    } catch (error) {
        return { data: null, error: 'Failed to fetch specific listing' };
    }
};

export const fetchListings = async (
    query: ListingsQuery,
    email?: string
): Promise<{ data: Listing[], metaData: ListingsMetaData, error: string | null }> => {
    try {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.append(key, value.toString());
            }
        });

        const response = await fetch(
            `${BASE_URL}/listings?${params.toString()}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Email": email || "",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return {
                data: [],
                metaData: {
                    total: 0,
                    offset: 0,
                    limit: 10,
                },
                error: 'Failed to fetch listings'
            }
        }

        const data = await response.json();

        return {
            data: data.data as Listing[],
            metaData: {
                total: Number(data.metaData?.total ?? 0),
                offset: Number(data.metaData?.offset ?? 0),
                limit: Number(data.metaData?.limit ?? 10),
            },
            error: null,
        };
    } catch (error) {
        return {
            data: [],
            metaData: {
                total: 0,
                offset: 0,
                limit: 10,
            },
            error: 'Failed to fetch listings'
        }
    }
};



export const fetchSuburbs = async () => {
    try {
        const response = await fetch(`${BASE_URL}/listings/suburbs`, {
            cache: "no-store",
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data?.data ?? [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const fetchPropertyTypes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/listings/property-types`, {
            cache: "no-store",
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data?.data ?? [];
    }
    catch (error) {
        console.error(error);
        return [];
    }
}