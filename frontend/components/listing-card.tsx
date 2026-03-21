"use client";

import { Listing } from "@/lib/types/listings";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
    CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate, formatPrice } from "@/lib/common";

const ListingCard = ({ listing }: { listing: Listing }) => {
    return (
        <Link href={`/listings/${listing.slug}`} className="block">
            <Card className="transition-shadow hover:shadow-md relative pt-0 rounded-xs">
                <CardHeader className="flex flex-col p-0">
                    <div className="h-[200px] aspect-square w-full">
                        <Image src={listing.image} alt={listing.title} width={300} height={300} className="h-full w-full object-cover" loading='eager' />
                    </div>
                    <div className="p-2 w-full">
                        <CardTitle className="truncate">{listing.title}</CardTitle>
                        <CardDescription className="flex items-center  justify-between">
                            <span>
                                {listing.beds} Beds &middot; {listing.baths} Baths
                            </span>

                            <span className="text-xs text-muted-foreground ml-auto">
                                {formatDate(listing?.created_at)}
                            </span>
                        </CardDescription>
                    </div>
                    {listing.property_type && (
                        <CardAction className="absolute top-2 right-2">
                            <Badge variant="secondary">
                                {listing.property_type.charAt(0).toUpperCase() +
                                    listing.property_type.slice(1)}
                            </Badge>
                        </CardAction>
                    )}
                </CardHeader>
                <CardFooter className="justify-between">
                    <span className="text-base font-bold">
                        {formatPrice(listing.price)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {listing.suburb}
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
};

export default ListingCard;
