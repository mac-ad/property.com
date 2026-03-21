import { ListingsQuery, ListingsResponse, Listing } from "../types/listings";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchListingBySlug = async (
    slug: string,
    email?: string
): Promise<Listing | null> => {
    const response = await fetch(`${BASE_URL}/listings/${slug}`, {
        headers: {
            "Content-Type": "application/json",
            "X-Email": email || "",
        },
        cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();

    return (data.data as Listing) ?? null;
};

export const fetchListings = async (
    query: ListingsQuery,
    email?: string
): Promise<ListingsResponse> => {
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
            }
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
    };
};
