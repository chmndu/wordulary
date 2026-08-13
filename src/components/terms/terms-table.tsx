import type { TermListItem } from "@/types/term-list-item";
import Link from "next/link";
import { deleteTermAction } from "@/actions/terms";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { formatDate } from "@/lib/date";

type TermsTableProps = {
    terms: TermListItem[];
    hasSearch: boolean;
    hasActiveFilter: boolean;
};

export function TermsTable({ terms, hasSearch, hasActiveFilter }: TermsTableProps) {
    if (terms.length === 0) {
        if (hasSearch) {
            return (
                <div className="rounded-xl border p-8 text-center">
                    <h3 className="font-semibold">
                        No matching terms found
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Try a different search term.
                    </p>
                </div>
            );
        }

        if (hasActiveFilter) {
            return (
                <div className="rounded-xl border p-8 text-center">
                    <h3 className="font-semibold">
                        No matching terms found
                    </h3>
                </div>
            );
        }

        return (
            <div className="rounded-xl border p-8 text-center">
                <h3 className="font-semibold">
                    No terms yet
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                    Import your vocabulary list or add your first term to start building your library.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="hidden rounded-xl border lg:block">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                                Term
                            </th>

                            <th className="lg:w-32 xl:w-36 px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                                Type
                            </th>

                            <th className="lg:w-28 xl:w-40 px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
                                Status
                            </th>

                            <th className="lg:w-36 xl:w-40 px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
                                AI Status
                            </th>

                            <th className="lg:w-36 xl:w-40 px-4 py-3 text-right text-sm font-semibold text-muted-foreground">
                                Created
                            </th>

                            <th className="lg:w-28 xl:w-36 px-6 py-3 text-right  text-sm font-semibold text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {terms.map((term) => (
                            <tr
                                key={term.id}
                                className="border-b transition-colors hover:bg-muted/50"
                            >
                                <td className="px-6 py-3">
                                    <Link
                                        href={`/dashboard/terms/${term.id}`}
                                        className="font-medium transition-colors wrap-break-word hover:text-primary hover:underline"
                                    >
                                        {term.term}
                                    </Link>
                                </td>

                                <td className="px-4 py-3 text-muted-foreground capitalize">
                                    {term.termType}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <Badge variant="secondary" className="capitalize">
                                        {term.status}
                                    </Badge>
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <Badge variant="outline" className="gap-1">
                                        {term.aiGenerated && <Sparkles className="size-3" />}
                                        {term.aiGenerated ? "AI Generated" : "Missing AI"}
                                    </Badge>
                                </td>

                                <td className="px-4 py-3 text-right text-muted-foreground">
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
                                            />
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
                {terms.map((term) => (
                    <div
                        key={term.id}
                        className="relative rounded-xl border p-4 transition-colors hover:bg-muted/50"
                    >
                        <Link
                            href={`/dashboard/terms/${term.id}`}
                            className="block group"
                        >
                            <p className="text-lg font-semibold transition-colors wrap-break-word group-hover:text-primary group-hover:underline">
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
                                <Badge variant="secondary" className="capitalize">
                                    {term.status}
                                </Badge>

                                <Badge variant="outline" className="gap-1">
                                    {term.aiGenerated && <Sparkles className="size-3" />}
                                    {term.aiGenerated ? "AI Generated" : "Missing AI"}
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
                                />
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}