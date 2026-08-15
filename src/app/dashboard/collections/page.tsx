import { CreateCollectionForm } from "@/components/collections/create-collection-form";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
    buildCollectionsUrl,
    parseCollectionsQuery,
} from "@/lib/collections/query";
import { COLLECTIONS_PER_PAGE } from "@/lib/constants";
import { Pagination } from "@/components/ui/pagination";
import { CollectionListItem } from "@/components/collections/collection-list-item";

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
                    <CollectionListItem
                        key={collection.id}
                        collection={{
                            id: collection.id,
                            name: collection.name,
                            termCount: collection.term_collections[0]?.count ?? 0,
                        }}
                    />
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