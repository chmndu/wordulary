export type CollectionsQuery = {
    page: number;
};

export type ParsedCollectionsQuery = {
    filters: CollectionsQuery;
    shouldRedirect: boolean;
};

export function parseCollectionsQuery(
    searchParams: {
        page?: string;
    }
): ParsedCollectionsQuery {
    let shouldRedirect = false;

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
            page,
        },
        shouldRedirect,
    };
}

export function buildCollectionsUrl({
    page = 1,
}: Partial<CollectionsQuery> = {}) {
    const params = new URLSearchParams();

    if (page > 1) {
        params.set("page", String(page));
    }

    const query = params.toString();

    return query
        ? `/dashboard/collections?${query}`
        : "/dashboard/collections";
}