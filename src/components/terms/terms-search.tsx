"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "../ui/loading-spinner";
import { cn } from "@/lib/utils";
import { buildTermsUrl } from "@/lib/terms/query";
import type { TermsQuery } from "@/lib/terms/query";

type TermsSearchProps = {
    initialSearch: TermsQuery["search"];
    status: TermsQuery["status"];
    ai: TermsQuery["ai"];
};

export function TermsSearch({
    initialSearch,
    status,
    ai,
}: TermsSearchProps) {
    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);

    const timeoutRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const input = inputRef.current;

        if (!input) {
            return;
        }

        // Do not overwrite what the user is currently typing.
        if (document.activeElement === input) {
            return;
        }

        if (input.value !== initialSearch) {
            input.value = initialSearch;
        }
    }, [initialSearch]);

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const value = event.target.value;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const trimmedValue = value.trim();

            if (trimmedValue === initialSearch) {
                return;
            }

            const url = buildTermsUrl({
                search: trimmedValue,
                status,
                ai,
            });

            startTransition(() => {
                router.replace(url);
            });
        }, 300);
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="relative">
            <Input
                ref={inputRef}
                type="search"
                defaultValue={initialSearch}
                onChange={handleChange}
                placeholder="Search vocabulary..."
                className={cn(isPending && "pr-9")}
            />

            {isPending && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                    <LoadingSpinner className="size-4" />
                </div>
            )}
        </div>
    );
}