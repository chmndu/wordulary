"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildTermsUrl } from "@/lib/terms/query";
import type { TermsQuery } from "@/lib/terms/query";

type PaginationProps = {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    search: TermsQuery["search"];
    status: TermsQuery["status"];
    ai: TermsQuery["ai"];
};

export function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    search,
    status,
    ai
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        totalItems
    );

    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
        pages.push(
            1,
            "...",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
        );
    } else {
        pages.push(
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages
        );
    }

    const navButtonClass = "gap-1 px-2 sm:px-3";

    return (
        <nav
            aria-label="Pagination"
            className="flex flex-col items-center gap-4 border-t pt-6 sm:flex-row sm:justify-between"
        >
            <p className="text-sm text-muted-foreground">
                Showing {startItem}–{endItem} of {totalItems} terms
            </p>

            <div className="flex items-center gap-1 whitespace-nowrap">
                {currentPage === 1 ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className={navButtonClass}
                        disabled
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="size-4" />
                        <span className="hidden sm:inline">
                            Previous
                        </span>
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className={navButtonClass}
                        asChild
                    >
                        <Link
                            href={
                                buildTermsUrl({
                                    search,
                                    status,
                                    ai,
                                    page: currentPage - 1,
                                })
                            }
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="size-4" />
                            <span className="hidden sm:inline">
                                Previous
                            </span>
                        </Link>
                    </Button>
                )}

                <div className="flex items-center gap-1">
                    {pages.map((page, index) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="flex items-center px-2 text-muted-foreground"
                                >
                                    ...
                                </span>
                            );
                        }

                        if (page === currentPage) {
                            return (
                                <Button
                                    key={page}
                                    variant="outline"
                                    size="sm"
                                    className="min-w-9 cursor-default pointer-events-none"
                                    aria-current="page"
                                >
                                    {page}
                                </Button>
                            );
                        }

                        return (
                            <Button
                                key={page}
                                variant="ghost"
                                size="sm"
                                className="min-w-9"
                                asChild
                            >
                                <Link
                                    href={
                                        buildTermsUrl({
                                            search,
                                            status,
                                            ai,
                                            page,
                                        })
                                    }
                                    aria-label={`Page ${page}`}
                                >
                                    {page}
                                </Link>
                            </Button>
                        );
                    })}
                </div>

                {currentPage === totalPages ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className={navButtonClass}
                        disabled
                        aria-label="Next page"
                    >
                        <span className="hidden sm:inline">
                            Next
                        </span>
                        <ChevronRight className="size-4" />
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className={navButtonClass}
                        asChild
                    >
                        <Link
                            href={
                                buildTermsUrl({
                                    search,
                                    status,
                                    ai,
                                    page: currentPage + 1,
                                })
                            }
                            aria-label="Next page"
                        >
                            <span className="hidden sm:inline">
                                Next
                            </span>
                            <ChevronRight className="size-4" />
                        </Link>
                    </Button>
                )}
            </div>
        </nav>
    );
}