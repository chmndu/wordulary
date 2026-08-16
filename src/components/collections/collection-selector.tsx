"use client";

import { useState } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { CollectionCheckboxList } from "./collection-checkbox-list";

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

            <CollectionCheckboxList
                collections={collections}
                selectedIds={selectedIds}
                disabled={saving}
                onChange={handleChange}
            />

            {saving && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LoadingSpinner className="size-3" />
                    Saving...
                </div>
            )}
        </div>
    );
}