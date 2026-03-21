import { Listing } from "@/lib/types/listings";
import { Card, CardContent } from "./ui/card";
import ListingCard from "./listing-card";

const ListingGrid = ({ data }: { data: Listing[] }) => {
    if (data.length === 0) {
        return (
            <Card className="py-12">
                <CardContent className="flex flex-col items-center text-center">
                    <p className="text-lg font-medium">No properties found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Try adjusting your filters or search terms.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
            ))}
        </div>
    );
};

export default ListingGrid;
