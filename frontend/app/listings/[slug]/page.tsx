import { cookies } from "next/headers";
import { fetchListingBySlug } from "@/lib/api/listings";

import ListingDetail from "@/components/listing-detail";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function ListingDetailPage({ params }: Props) {
    const { slug } = await params;
    const cookiesStore = await cookies();
    const email = cookiesStore.get("email")?.value;


    const { data: listing, error } = await fetchListingBySlug(slug, email);

    if (!listing && !error) return redirect("/listings")

    if (!listing && error) return (
        <div className="max-w-7xl mx-auto py-12 flex flex-col items-center min-h-[40vh] text-center">

            <h2 className="text-2xl font-semibold text-red-500">
                Failed to fetch listing
            </h2>
            <p className="text-muted-foreground text-base">
                {error ?? "An error occurred while fetching the listing. Please try again later."}
            </p>
            <Link
                href="/listings"
                className="mt-4"
            >
                <Button className="cursor-pointer">
                    Back to Listings
                </Button>
            </Link>
        </div>
    )

    if (!listing) return notFound();

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-6">
            <ListingDetail
                listing={listing}
            />
        </div>
    );
}
