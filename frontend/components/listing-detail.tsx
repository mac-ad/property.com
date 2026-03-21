"use client";

import { formatDate, formatPrice } from "@/lib/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { ArrowLeft, Bath, BedDouble, Calendar, Home, MapPin } from "lucide-react";
import Image from "next/image";
import { Listing } from "@/lib/types/listings";
import { useRouter } from "next/navigation";


const ListingDetail = ({ listing }: { listing: Listing }) => {

    const router = useRouter();

    return (
        <div>
            <Button variant="ghost" size="sm" className="cursor-pointer mb-8" onClick={() => router.back()}>
                <ArrowLeft />
                Back to listings
            </Button>

            <div className="flex space-x-7">
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl max-w-[500px]">
                    <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        priority
                        loading='eager'
                    />
                </div>

                <div className="flex-1 flex flex-col gap-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1">
                            <div className="text-left">
                                <p className="text-2xl font-bold sm:text-3xl">
                                    {formatPrice(listing.price)}
                                </p>
                            </div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                {listing.title}
                            </h2>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="size-4" />
                                <span>{listing.suburb}</span>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-wrap gap-2">
                        {listing.property_type && (
                            <Badge variant="secondary">
                                <Home className="size-3" />
                                {listing.property_type.charAt(0).toUpperCase() +
                                    listing.property_type.slice(1)}
                            </Badge>
                        )}
                        <Badge variant="outline">
                            <BedDouble className="size-3" />
                            {listing.beds} Beds
                        </Badge>
                        <Badge variant="outline">
                            <Bath className="size-3" />
                            {listing.baths} Baths
                        </Badge>
                        <Badge variant="outline">
                            <Calendar className="size-3" />
                            {formatDate(listing.created_at)}
                        </Badge>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Property Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">Type</dt>
                                    <dd className="font-medium mt-0.5">
                                        {listing.property_type
                                            ? listing.property_type
                                                .charAt(0)
                                                .toUpperCase() +
                                            listing.property_type.slice(1)
                                            : "—"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Bedrooms</dt>
                                    <dd className="font-medium mt-0.5">
                                        {listing.beds}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Bathrooms</dt>
                                    <dd className="font-medium mt-0.5">
                                        {listing.baths}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Suburb</dt>
                                    <dd className="font-medium mt-0.5">
                                        {listing.suburb}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Price</dt>
                                    <dd className="font-medium mt-0.5">
                                        {formatPrice(listing.price)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Listed</dt>
                                    <dd className="font-medium mt-0.5">
                                        {formatDate(listing.created_at)}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    {listing.internal_notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Internal Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {listing.internal_notes}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListingDetail
