import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { fetchListingBySlug } from "@/lib/api/listings";

import ListingDetail from "@/components/listing-detail";

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function ListingDetailPage({ params }: Props) {
    const { slug } = await params;
    const cookiesStore = await cookies();
    const email = cookiesStore.get("email")?.value;

    const listing = await fetchListingBySlug(slug, email);
    if (!listing) notFound();


    return (
        <div className="max-w-7xl mx-auto py-6 space-y-6">
            <ListingDetail
                listing={listing}
            />
        </div>
    );
}
