"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const DEFAULT_LIMIT = 10;

export default function ListingsPagination({ total }: { total: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
    const offset = Number(searchParams.get("offset")) || 0;
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) return null;

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        const newOffset = (page - 1) * limit;
        if (newOffset > 0) {
            params.set("offset", newOffset.toString());
        } else {
            params.delete("offset");
        }
        router.push(`/listings?${params.toString()}`);
    };

    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);
        if (currentPage > 3) pages.push("...");

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);

        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);

        return pages;
    };

    return (
        <nav className="flex items-center justify-center gap-1 pt-6">
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className="cursor-pointer"
                aria-label="Previous page"
            >
                <ChevronLeft />
                <span className="hidden sm:inline">Prev</span>
            </Button>

            {getPageNumbers().map((page, i) =>
                page === "..." ? (
                    <span
                        key={`dots-${i}`}
                        className="flex size-7 items-center justify-center text-sm text-muted-foreground select-none"
                    >
                        &hellip;
                    </span>
                ) : (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "ghost"}
                        size="icon-sm"
                        onClick={() => goToPage(page)}
                        className="cursor-pointer"
                        aria-current={
                            page === currentPage ? "page" : undefined
                        }
                    >
                        {page}
                    </Button>
                )
            )}

            <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="cursor-pointer"
                aria-label="Next page"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight />
            </Button>
        </nav>
    );
}
