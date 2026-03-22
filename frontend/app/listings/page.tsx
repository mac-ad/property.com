import { Suspense } from "react";
import ListingGrid from "@/components/listing-grid";
import ListingsToolbar from "@/components/listings-toolbar";
import ListingsPagination from "@/components/listings-pagination";
import { fetchListings } from "@/lib/api/listings";
import { cookies } from "next/headers";
import { ListingsQuery } from "@/lib/types/listings";

const ITEMS_PER_PAGE = 10;

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ListingsPage = async ({ searchParams }: Props) => {
    const params = await searchParams;
    const cookiesStore = await cookies();
    const email = cookiesStore.get("email")?.value;

    const str = (key: string) => {
        const v = params[key];
        return typeof v === "string" ? v : undefined;
    };
    const num = (key: string) => {
        const v = str(key);
        return v ? Number(v) : undefined;
    };

    const query: ListingsQuery = {
        keyword: str("keyword"),
        suburb: str("suburb"),
        min_price: num("min_price"),
        max_price: num("max_price"),
        beds: num("beds"),
        baths: num("baths"),
        property_type: str("property_type"),
        sort: (str("sort") as ListingsQuery["sort"]) || "newest",
        limit: num("limit") || ITEMS_PER_PAGE,
        offset: num("offset") || 0,
    };

    const { data: listings, metaData, error } = await fetchListings(query, email);

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-6">
            <Suspense
                fallback={
                    <div className="h-[52px] animate-pulse rounded-lg bg-muted" />
                }
            >
                <ListingsToolbar />
            </Suspense>

            <p className="text-sm text-muted-foreground">
                {metaData.total > 0
                    ? `Showing ${metaData.offset + 1}\u2013${Math.min(
                        metaData.offset + metaData.limit,
                        metaData.total
                    )} of ${metaData.total} properties`
                    : "No properties match your criteria"}
            </p>

            <ListingGrid data={listings} />

            <Suspense>
                <ListingsPagination total={metaData.total} />
            </Suspense>
        </div>
    );
};

export default ListingsPage;
