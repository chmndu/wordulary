"use client";

import { useState } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Checkbox } from "@/components/ui/checkbox";

type CollectionSelectorProps = {
    termId: string;

    collections: {
        id: string;
        name: string;
    }[];

    selectedCollectionIds: string[];
};

export function CollectionSelector({
    termId,
    collections,
    selectedCollectionIds,
}: CollectionSelectorProps) {
    const [selectedIds, setSelectedIds] = useState(selectedCollectionIds);

    const [saving, setSaving] = useState(false);

    if (collections.length === 0) {
        return null;
    }

    async function handleChange(
        collectionId: string,
        checked: boolean
    ) {
        if (saving) return;

        const previousIds = [...selectedIds];

        try {
            setSaving(true);

            if (checked) {
                setSelectedIds(prev => [...prev, collectionId]);
            } else {
                setSelectedIds(prev =>
                    prev.filter(id => id !== collectionId)
                );
            }

            const response =
                await fetch(
                    `/api/terms/${termId}/collections`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            collectionId,
                            checked,
                        }),
                    }
                );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Failed to update collection");
            }
        } catch (error) {
            console.error(error);

            setSelectedIds(previousIds);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-2">
            <h2 className="text-lg font-semibold">
                Collections
            </h2>

            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {collections.map(
                    (collection) => (
                        <label
                            key={collection.id}
                            htmlFor={collection.id}
                            className="flex min-w-0 cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/50 active:bg-muted"
                        >
                            <Checkbox
                                id={collection.id}
                                checked={selectedIds.includes(collection.id)}
                                disabled={saving}
                                onCheckedChange={(checked) =>
                                    handleChange(collection.id, checked === true)
                                }
                            />

                            <span className="truncate">{collection.name}</span>
                        </label>
                    )
                )}

                {saving && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <LoadingSpinner className="size-3" />
                        Saving...
                    </div>
                )}
            </div>
        </div>
    );
}