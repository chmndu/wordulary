const VALID_STATUSES = [
    "new",
    "learning",
    "mastered",
] as const;

const VALID_AI = [
    "generated",
    "missing",
] as const;

export type TermStatus = (typeof VALID_STATUSES)[number];

export type AiFilter = (typeof VALID_AI)[number];

export type TermsQuery = {
    search: string;
    status: TermStatus | "";
    ai: AiFilter | "";
    page: number;
};

export type ParsedTermsQuery = {
    filters: TermsQuery;
    shouldRedirect: boolean;
};

export function parseTermsQuery(
    searchParams: {
        search?: string;
        status?: string;
        ai?: string;
        page?: string;
    }
): ParsedTermsQuery {
    let shouldRedirect = false;

    // -----------------------------
    // Search
    // -----------------------------

    const rawSearch = searchParams.search ?? "";
    const search = rawSearch.trim();

    if (rawSearch !== search) {
        shouldRedirect = true;
    }

    // -----------------------------
    // Status
    // -----------------------------

    let status: TermStatus | "" = "";

    if (searchParams.status) {
        if (
            VALID_STATUSES.includes(
                searchParams.status as TermStatus
            )
        ) {
            status = searchParams.status as TermStatus;
        } else {
            shouldRedirect = true;
        }
    }

    // -----------------------------
    // AI
    // -----------------------------

    let ai: AiFilter | "" = "";

    if (searchParams.ai) {
        if (
            VALID_AI.includes(
                searchParams.ai as AiFilter
            )
        ) {
            ai = searchParams.ai as AiFilter;
        } else {
            shouldRedirect = true;
        }
    }

    // -----------------------------
    // Page
    // -----------------------------

    let page = 1;

    if (searchParams.page) {
        const parsed = Number(searchParams.page);

        if (
            Number.isInteger(parsed) &&
            parsed > 1
        ) {
            page = parsed;
        } else {
            shouldRedirect = true;
        }
    }

    return {
        filters: {
            search,
            status,
            ai,
            page,
        },
        shouldRedirect,
    };
}

export function buildTermsUrl({
    search = "",
    status = "",
    ai = "",
    page = 1,
}: Partial<TermsQuery>) {
    const params = new URLSearchParams();

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
        params.set("search", trimmedSearch);
    }

    if (status) {
        params.set("status", status);
    }

    if (ai) {
        params.set("ai", ai);
    }

    if (page > 1) {
        params.set("page", String(page));
    }

    const query = params.toString();

    return query
        ? `/dashboard/terms?${query}`
        : "/dashboard/terms";
}