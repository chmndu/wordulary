export type CollectionDetailQuery = {
    page: number;
};

export type ParsedCollectionDetailQuery = {
    filters: CollectionDetailQuery;
    shouldRedirect: boolean;
};

export function parseCollectionDetailQuery(
    searchParams: {
        page?: string;
    }
): ParsedCollectionDetailQuery {
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

export function buildCollectionDetailUrl(
    collectionId: string,
    { page = 1 }: Partial<CollectionDetailQuery> = {}
) {
    const params = new URLSearchParams();

    if (page > 1) {
        params.set("page", String(page));
    }

    const query = params.toString();

    return query
        ? `/dashboard/collections/${collectionId}?${query}`
        : `/dashboard/collections/${collectionId}`;
}