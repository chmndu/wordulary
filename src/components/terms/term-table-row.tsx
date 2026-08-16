"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import { deleteTermAction } from "@/actions/terms";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import type { TermListItem } from "@/types/term-list-item";
import { formatTermType } from "@/lib/terms/format-term-type";

type TermTableRowProps = {
    term: TermListItem;
};

export function TermTableRow({
    term,
}: TermTableRowProps) {
    const [deleting, setDeleting] = useState(false);

    return (
        <tr
            className={`border-b transition-colors ${deleting
                    ? "opacity-60"
                    : "hover:bg-muted/50"
                }`}
        >
            <td className="px-6 py-3">
                <Link
                    href={`/dashboard/terms/${term.id}`}
                    className={`font-medium transition-colors wrap-break-word hover:text-primary hover:underline ${deleting
                            ? "pointer-events-none"
                            : ""
                        }`}
                    aria-disabled={deleting}
                    onClick={(event) => {
                        if (deleting) {
                            event.preventDefault();
                        }
                    }}
                >
                    {term.term}
                </Link>
            </td>

            <td className="px-4 py-3 text-sm text-muted-foreground">
                {formatTermType(term.termType)}
            </td>

            <td className="px-4 py-3 text-center">
                <Badge
                    variant="secondary"
                    className="capitalize"
                >
                    {term.status}
                </Badge>
            </td>

            <td className="px-4 py-3 text-center">
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
            </td>

            <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                {formatDate(term.createdAt)}
            </td>

            <td className="px-6 py-3">
                <div className="flex justify-end">
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
            </td>
        </tr>
    );
}