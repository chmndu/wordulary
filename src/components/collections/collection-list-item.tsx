"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteCollection } from "@/actions/collections";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";

type CollectionListItemProps = {
    collection: {
        id: string;
        name: string;
        termCount: number;
    };
};

export function CollectionListItem({
    collection,
}: CollectionListItemProps) {
    const [deleting, setDeleting] = useState(false);

    return (
        <div
            className={`relative rounded-xl border p-4 transition-colors ${deleting
                ? "opacity-60"
                : "hover:bg-muted/50"
                }`}
        >
            <Link
                href={`/dashboard/collections/${collection.id}`}
                className={`block group pr-10 ${
                    deleting ? "cursor-default" : "cursor-pointer"
                }`}
                aria-disabled={deleting}
                onClick={(event) => {
                    if (deleting) {
                        event.preventDefault();
                    }
                }}
            >
                <div className="flex items-center justify-between gap-4">
                    <span
                        className={`min-w-0 truncate font-medium transition-colors ${deleting
                            ? ""
                            : "group-hover:text-primary group-hover:underline"
                        }`}
                    >
                        {collection.name}
                    </span>

                    <span className="shrink-0 text-sm text-muted-foreground">
                        {collection.termCount}{" "}
                        {collection.termCount === 1
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
                        onDeletingChange={setDeleting}
                    />
                </form>
            </div>
        </div>
    );
}