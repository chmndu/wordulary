import type { TermListItem } from "@/types/term-list-item";
import { TermListCard } from "@/components/terms/term-list-card";
import { TermTableRow } from "@/components/terms/term-table-row";

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
                            <TermTableRow
                                key={term.id}
                                term={term}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
                {terms.map((term) => (
                    <TermListCard
                        key={term.id}
                        term={term}
                    />
                ))}
            </div>
        </>
    );
}