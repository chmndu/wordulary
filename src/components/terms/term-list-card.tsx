"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import { deleteTermAction } from "@/actions/terms";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import type { TermListItem } from "@/types/term-list-item";

type TermListCardProps = {
    term: TermListItem;
};

export function TermListCard({
    term,
}: TermListCardProps) {
    const [deleting, setDeleting] = useState(false);

    return (
        <div
            className={`relative rounded-xl border p-4 transition-colors ${deleting
                ? "opacity-60"
                : "hover:bg-muted/50"
                }`}
        >
            <Link
                href={`/dashboard/terms/${term.id}`}
                className={`block group ${
                    deleting ? "cursor-default" : "cursor-pointer"
                }`}
                aria-disabled={deleting}
                onClick={(event) => {
                    if (deleting) {
                        event.preventDefault();
                    }
                }}
            >
                <p
                    className={`text-lg font-semibold transition-colors wrap-break-word ${deleting
                        ? ""
                        : "group-hover:text-primary group-hover:underline"
                    }`}
                >
                    {term.term}
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="capitalize">
                        {term.termType}
                    </span>

                    <span>•</span>

                    <span>
                        {formatDate(term.createdAt)}
                    </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                        variant="secondary"
                        className="capitalize"
                    >
                        {term.status}
                    </Badge>

                    <Badge
                        variant="outline"
                        className="gap-1"
                    >
                        {term.aiGenerated && (
                            <Sparkles className="size-3" />
                        )}

                        {term.aiGenerated
                            ? "AI Generated"
                            : "Missing AI"}
                    </Badge>
                </div>
            </Link>

            <div className="absolute bottom-3 right-3">
                <form action={deleteTermAction}>
                    <input
                        type="hidden"
                        name="id"
                        value={term.id}
                    />

                    <ConfirmDeleteButton
                        itemName={term.term}
                        itemType="Term"
                        iconOnly
                        onDeletingChange={setDeleting}
                    />
                </form>
            </div>
        </div>
    );
}