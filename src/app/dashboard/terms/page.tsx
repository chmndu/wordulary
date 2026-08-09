import { createClient } from "@/lib/supabase/server";
import { TermsTable } from "@/components/terms/terms-table";
import { TermsSearch } from "@/components/terms/terms-search";
import { TermsFilters } from "@/components/terms/terms-filters";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { TERMS_PER_PAGE } from "@/lib/constants";
import { Pagination } from "@/components/ui/pagination";
import { redirect } from "next/navigation";
import { buildTermsUrl, parseTermsQuery } from "@/lib/terms/query";

export const metadata: Metadata = {
    title: "Vocabulary",
};

type PageProps = {
    searchParams: Promise<{
        search?: string;
        status?: string;
        ai?: string;
        page?: string;
    }>;
};

export default async function TermsPage({ searchParams }: PageProps) {
    const parsed = parseTermsQuery(await searchParams);

    if (parsed.shouldRedirect) {
        redirect(buildTermsUrl(parsed.filters));
    }

    const {
        search,
        status,
        ai,
        page,
    } = parsed.filters;

    const searchQuery = search;

    const currentPage = page;

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    // -----------------------------------------------------------------
    // Build the filtered query (used for count)
    // -----------------------------------------------------------------

    let countQuery = supabase
        .from("terms")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("user_id", user.id);

    if (searchQuery) {
        countQuery = countQuery.ilike(
            "term",
            `%${searchQuery}%`
        );
    }

    if (
        status &&
        ["new", "learning", "mastered"].includes(status)
    ) {
        countQuery = countQuery.eq("status", status);
    }

    if (ai === "generated") {
        countQuery = countQuery.eq(
            "ai_generated",
            true
        );
    }

    if (ai === "missing") {
        countQuery = countQuery.eq(
            "ai_generated",
            false
        );
    }

    const {
        count: totalTerms,
        error: countError,
    } = await countQuery;

    if (countError) {
        throw countError;
    }

    const {
        count: userTotalTerms,
        error: userTotalTermsError,
    } = await supabase
        .from("terms")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("user_id", user.id);

    if (userTotalTermsError) {
        throw userTotalTermsError;
    }

    const totalPages = Math.max(
        1,
        Math.ceil((totalTerms ?? 0) / TERMS_PER_PAGE)
    );

    if (
        (totalTerms ?? 0) > 0 &&
        currentPage > totalPages
    ) {
        redirect(
            buildTermsUrl({
                search: searchQuery,
                status,
                ai,
                page: totalPages,
            })
        );
    }

    // -----------------------------------------------------------------
    // Fetch only the current page
    // -----------------------------------------------------------------

    const from = (currentPage - 1) * TERMS_PER_PAGE;

    const to = from + TERMS_PER_PAGE - 1;

    let dataQuery = supabase
        .from("terms")
        .select(`
            id,
            term,
            term_type,
            status,
            ai_generated,
            created_at
        `)
        .eq("user_id", user.id);

    if (searchQuery) {
        dataQuery = dataQuery.ilike(
            "term",
            `%${searchQuery}%`
        );
    }

    if (
        status &&
        ["new", "learning", "mastered"].includes(status)
    ) {
        dataQuery = dataQuery.eq(
            "status",
            status
        );
    }

    if (ai === "generated") {
        dataQuery = dataQuery.eq(
            "ai_generated",
            true
        );
    }

    if (ai === "missing") {
        dataQuery = dataQuery.eq(
            "ai_generated",
            false
        );
    }

    const {
        data: terms,
        error,
    } = await dataQuery
        .order("created_at", {
            ascending: false,
        })
        .range(from, to);

    if (error) {
        throw error;
    }

    const termListItems = (terms ?? []).map((term) => ({
        id: term.id,
        term: term.term,
        termType: term.term_type,
        status: term.status,
        aiGenerated: term.ai_generated,
        createdAt: term.created_at,
    }));

    const hasTerms = (userTotalTerms ?? 0) > 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Your Terms
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage and study your vocabulary.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button asChild>
                        <Link href="/dashboard/terms/new">
                            Add New Term
                        </Link>
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href="/dashboard/terms/import">
                            Import Terms
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border p-6 space-y-6">
                <TermsSearch
                    initialSearch={search}
                    status={status}
                    ai={ai}
                />

                <TermsFilters
                    hasTerms={hasTerms}
                    status={status}
                    ai={ai}
                    searchQuery={searchQuery}
                    resultCount={totalTerms ?? 0}
                />
            </div>

            <TermsTable
                terms={termListItems}
                hasSearch={Boolean(searchQuery)}
                hasActiveFilter={Boolean(status || ai)}
            />

            <Pagination
                currentPage={currentPage}
                totalItems={totalTerms ?? 0}
                itemsPerPage={TERMS_PER_PAGE}
                search={search}
                status={status}
                ai={ai}
            />
        </div>
    );
}