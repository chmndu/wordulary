import { deleteCollection } from "@/actions/collections";
import { CreateCollectionForm } from "@/components/collections/create-collection-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { redirect } from "next/navigation";
import {
    buildCollectionsUrl,
    parseCollectionsQuery,
} from "@/lib/collections/query";
import { COLLECTIONS_PER_PAGE } from "@/lib/constants";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = {
    title: "Collections",
};

type PageProps = {
    searchParams: Promise<{
        page?: string;
    }>;
};

export default async function CollectionsPage({
    searchParams,
}: PageProps) {
    const parsed = parseCollectionsQuery(
        await searchParams
    );

    if (parsed.shouldRedirect) {
        redirect(
            buildCollectionsUrl(parsed.filters)
        );
    }

    const { page } = parsed.filters;

    const supabase = await createClient();

    // --------------------------------------------------------------
    // Get the current user's collections count
    // --------------------------------------------------------------

    const {
        count: totalCollections,
        error: countError,
    } = await supabase
        .from("collections")
        .select("*", {
            count: "exact",
            head: true,
        });

    if (countError) {
        throw countError;
    }

    const totalPages = Math.max(
        1,
        Math.ceil(
            (totalCollections ?? 0) /
            COLLECTIONS_PER_PAGE
        )
    );

    // --------------------------------------------------------------
    // Handle a page number that is beyond the last page
    // --------------------------------------------------------------

    if (
        (totalCollections ?? 0) > 0 &&
        page > totalPages
    ) {
        redirect(
            buildCollectionsUrl({
                page: totalPages,
            })
        );
    }

    // --------------------------------------------------------------
    // Fetch only the current page
    // --------------------------------------------------------------

    const from = (page - 1) * COLLECTIONS_PER_PAGE;

    const to = from + COLLECTIONS_PER_PAGE - 1;

    const {
        data: collections,
        error: collectionsError,
    } = await supabase
        .from("collections")
        .select(`
        *,
        term_collections(count)
    `)
        .order("created_at", {
            ascending: false,
        })
        .range(from, to);

    if (collectionsError) {
        throw collectionsError;
    }

    const collectionList = collections ?? [];

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-semibold tracking-tight">
                    Collections
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Organize your vocabulary into collections.
                </p>
            </section>

            <CreateCollectionForm />

            <section className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    {totalCollections ?? 0}{" "}
                    {(totalCollections ?? 0) === 1
                        ? "collection"
                        : "collections"}
                </p>

                {collectionList.map((collection) => (
                    <div
                        key={collection.id}
                        className="relative rounded-xl border p-4 transition-colors hover:bg-muted/50"
                    >
                        <Link
                            href={`/dashboard/collections/${collection.id}`}
                            className="block group pr-10"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <span className="min-w-0 font-medium transition-colors truncate group-hover:text-primary group-hover:underline">
                                    {collection.name}
                                </span>

                                <span className="shrink-0 text-sm text-muted-foreground">
                                    {collection.term_collections[0]?.count ?? 0}{" "}
                                    {collection.term_collections[0]?.count === 1
                                        ? "term"
                                        : "terms"}
                                </span>
                            </div>
                        </Link>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <form action={deleteCollection}>
                                <input
                                    type="hidden"
                                    name="id"
                                    value={collection.id}
                                />

                                <ConfirmDeleteButton
                                    itemName={collection.name}
                                    itemType="Collection"
                                    description="The collection will be deleted, but your terms will remain."
                                    iconOnly
                                />
                            </form>
                        </div>
                    </div>
                ))}

                {collectionList.length === 0 && (
                    <div className="rounded-xl border p-8 text-center">
                        <h3 className="font-semibold">
                            No collections yet
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Create your first collection
                            to organize your vocabulary.
                        </p>
                    </div>
                )}
            </section>

            <Pagination
                currentPage={page}
                totalItems={totalCollections ?? 0}
                itemsPerPage={COLLECTIONS_PER_PAGE}
                basePath="collections"
            />
        </div>
    );
}