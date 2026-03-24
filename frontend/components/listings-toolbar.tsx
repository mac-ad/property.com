"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, FormEvent, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { FILTER_KEYS, SORT_OPTIONS } from "@/lib/constant/listing";
import { useGlobalContext } from "@/store/global.context";

type Filters = {
    keyword: string;
    suburb: string;
    min_price: string;
    max_price: string;
    beds: string;
    baths: string;
    property_type: string;
    sort: string;
};

const SENTINEL_VALUES = new Set(["any", "all"]);

function filtersFromParams(params: URLSearchParams): Filters {
    return {
        keyword: params.get("keyword") || "",
        suburb: params.get("suburb") || "any",
        min_price: params.get("min_price") || "",
        max_price: params.get("max_price") || "",
        beds: params.get("beds") || "",
        baths: params.get("baths") || "any",
        property_type: params.get("property_type") || "all",
        sort: params.get("sort") || "newest",
    };
}

export default function ListingsToolbar({
    suburbs,
    propertyTypes
}: {
    suburbs: string[],
    propertyTypes: string[]
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<Filters>(() =>
        filtersFromParams(searchParams)
    );

    // const { suburbs, propertyTypes } = useGlobalContext();

    const suburbOptions = useMemo(() => suburbs.map((suburb) => ({ label: suburb.toUpperCase(), value: suburb })), [suburbs]);

    const propertyTypeOptions = useMemo(() => propertyTypes.map((propertyType) => ({ label: propertyType.toUpperCase(), value: propertyType })), [propertyTypes]);

    useEffect(() => {
        setFilters(filtersFromParams(searchParams));
    }, [searchParams]);

    const activeFilterCount = FILTER_KEYS.filter((k) => {
        const v = filters[k];
        return v !== "" && !SENTINEL_VALUES.has(v);
    }).length;

    const hasAnyActive =
        filters.keyword !== "" ||
        activeFilterCount > 0 ||
        filters.sort !== "newest";

    const applyFilters = useCallback(
        (overrides?: Partial<Filters>) => {
            const merged = { ...filters, ...overrides };
            const params = new URLSearchParams();

            Object.entries(merged).forEach(([key, value]) => {
                if (
                    value &&
                    value !== "" &&
                    !SENTINEL_VALUES.has(value) &&
                    !(key === "sort" && value === "newest")
                ) {
                    params.set(key, value);
                }
            });

            params.delete("offset");

            const qs = params.toString();
            router.push(qs ? `/listings?${qs}` : "/listings");
        },
        [filters, router]
    );

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleSelectChange = (key: keyof Filters, value: string | null) => {
        const v = value ?? "";
        setFilters((prev) => ({ ...prev, [key]: v }));
        applyFilters({ [key]: v });
    };

    const handleTextKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        key: keyof Filters
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            applyFilters({ [key]: e.currentTarget.value });
        }
    };

    const clearAll = () => {
        setFilters(filtersFromParams(new URLSearchParams()));
        router.push("/listings");
    };

    return (
        <div className="space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search properties..."
                        value={filters.keyword}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                keyword: e.target.value,
                            }))
                        }
                        className="h-9 pl-9"
                    />
                </div>
                <Button type="submit" size="lg" className="cursor-pointer">
                    Search
                </Button>
            </form>


            <Card className="p-4 ">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <Label className="text-xs text-muted-foreground">
                            Suburb
                        </Label>
                        <Select
                            value={filters.suburb}
                            onValueChange={(val) => handleSelectChange("suburb", val)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                {suburbOptions.map((suburb) => (
                                    <SelectItem key={suburb.value} value={suburb.value}>
                                        {suburb.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <Label className="text-xs text-muted-foreground">
                            Min Price
                        </Label>
                        <Input
                            type="number"
                            placeholder="No min"
                            value={filters.min_price}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    min_price: e.target.value,
                                }))
                            }
                            onBlur={() => applyFilters()}
                            onKeyDown={(e) =>
                                handleTextKeyDown(e, "min_price")
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <Label className="text-xs text-muted-foreground">
                            Max Price
                        </Label>
                        <Input
                            type="number"
                            placeholder="No max"
                            value={filters.max_price}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    max_price: e.target.value,
                                }))
                            }
                            onBlur={() => applyFilters()}
                            onKeyDown={(e) =>
                                handleTextKeyDown(e, "max_price")
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <Label className="text-xs text-muted-foreground">
                            Beds
                        </Label>
                        <Input
                            type="number"
                            placeholder="any"
                            value={filters.beds}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    beds: e.target.value,
                                }))
                            }
                            onBlur={() => applyFilters()}
                            onKeyDown={(e) =>
                                handleTextKeyDown(e, "beds")
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <Label className="text-xs text-muted-foreground">
                            Baths
                        </Label>
                        <Input
                            type="number"
                            placeholder="any"
                            value={filters.baths}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    baths: e.target.value,
                                }))
                            }
                            onBlur={() => applyFilters()}
                            onKeyDown={(e) =>
                                handleTextKeyDown(e, "baths")
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <Label className="text-xs text-muted-foreground">
                            Type
                        </Label>
                        <Select
                            value={filters.property_type}
                            onValueChange={(val) =>
                                handleSelectChange("property_type", val)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                {propertyTypeOptions.map((propertyType) => (
                                    <SelectItem key={propertyType.value} value={propertyType.value}>
                                        {propertyType.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card >


            <div className="flex items-center justify-between">
                <Select
                    value={filters.sort}
                    onValueChange={(val) => handleSelectChange("sort", val)}
                >
                    <SelectTrigger size="sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasAnyActive && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="cursor-pointer"
                    >
                        <X />
                        Clear all
                    </Button>
                )}
            </div>
        </div >
    );
}
