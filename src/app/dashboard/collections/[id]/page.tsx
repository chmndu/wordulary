import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
    buildCollectionDetailUrl,
    parseCollectionDetailQuery,
} from "@/lib/collections/detail-query";
import { TERMS_PER_PAGE } from "@/lib/constants";
import { Pagination } from "@/components/ui/pagination";
import { deleteCollection } from "@/actions/collections";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";

type CollectionTerm = {
    id: string;
    term: string;
    term_type: string;
    status: string;
};

type PageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{
        page?: string;
    }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            title: "Collection",
        };
    }

    const { data: collection } = await supabase
        .from("collections")
        .select("name")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    return {
        title: collection?.name ?? "Collection",
    };
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
    const supabase = await createClient();

    const { id } = await params;

    const parsed = parseCollectionDetailQuery(
        await searchParams
    );

    if (parsed.shouldRedirect) {
        redirect(
            buildCollectionDetailUrl(
                id,
                parsed.filters
            )
        );
    }

    const { page } = parsed.filters;

    const { data: collection, error } =
        await supabase
            .from("collections")
            .select("*")
            .eq("id", id)
            .single();

    if (error || !collection) {
        notFound();
    }

    // --------------------------------------------------------------
    // Count terms in this collection
    // --------------------------------------------------------------

    const {
        count: totalTerms,
        error: countError,
    } = await supabase
        .from("term_collections")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("collection_id", id);

    if (countError) {
        throw countError;
    }

    const totalPages = Math.max(
        1,
        Math.ceil(
            (totalTerms ?? 0) / TERMS_PER_PAGE
        )
    );

    // --------------------------------------------------------------
    // Handle a page number beyond the last page
    // --------------------------------------------------------------

    if (
        (totalTerms ?? 0) > 0 &&
        page > totalPages
    ) {
        redirect(
            buildCollectionDetailUrl(
                id,
                {
                    page: totalPages,
                }
            )
        );
    }

    // --------------------------------------------------------------
    // Fetch only the current page
    // --------------------------------------------------------------

    const from =
        (page - 1) * TERMS_PER_PAGE;

    const to =
        from + TERMS_PER_PAGE - 1;

    const {
        data: collectionTerms,
        error: collectionTermsError,
    } = await supabase
        .from("term_collections")
        .select(`
            term_id,
            terms (
                id,
                term,
                term_type,
                status
            )
        `)
        .eq("collection_id", id)
        .range(from, to);

    if (collectionTermsError) {
        throw collectionTermsError;
    }

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-semibold tracking-tight">
                    {collection.name}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    {totalTerms ?? 0}{" "}
                    {(totalTerms ?? 0) === 1
                        ? "term"
                        : "terms"}
                </p>
            </section>

            {(totalTerms ?? 0) === 0 ? (
                <section className="rounded-xl border p-8 text-center">
                    <h2 className="font-semibold">
                        No terms yet
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Add terms to this collection from the Term Details page.
                    </p>
                </section>
            ) : (
                <>
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {collectionTerms?.map(
                            (collectionTerm) => {
                                const term =
                                    collectionTerm.terms as unknown as CollectionTerm;

                                if (!term) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={
                                            collectionTerm.term_id
                                        }
                                        className="rounded-xl border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <Link
                                            href={`/dashboard/terms/${term.id}`}
                                            className="block group"
                                        >
                                            <p className="text-lg font-semibold transition-colors wrap-break-word group-hover:text-primary group-hover:underline">
                                                {term.term}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {term.term_type.replaceAll(
                                                        "_",
                                                        " "
                                                    )}
                                                </Badge>

                                                <Badge
                                                    variant="secondary"
                                                    className="capitalize"
                                                >
                                                    {term.status}
                                                </Badge>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            }
                        )}
                    </section>

                    <Pagination
                        currentPage={page}
                        totalItems={totalTerms ?? 0}
                        itemsPerPage={TERMS_PER_PAGE}
                        basePath="collection-detail"
                        collectionId={id}
                    />
                </>
            )}

            <div className="rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-destructive">
                    Danger Zone
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Permanently delete this collection.
                </p>

                <form
                    action={deleteCollection}
                    className="mt-4"
                >
                    <input
                        type="hidden"
                        name="id"
                        value={collection.id}
                    />

                    <ConfirmDeleteButton
                        label="Delete Collection"
                        itemName={collection.name}
                        itemType="Collection"
                        description="The collection will be deleted, but your terms will remain."
                        variant="destructive"
                    />
                </form>
            </div>
        </div>
    );
}