"use client";

import { Checkbox } from "@/components/ui/checkbox";

type CollectionCheckboxListProps = {
    collections: {
        id: string;
        name: string;
    }[];
    selectedIds: string[];
    disabled?: boolean;
    onChange: (collectionId: string, checked: boolean) => void;
};

export function CollectionCheckboxList({
    collections,
    selectedIds,
    disabled = false,
    onChange,
}: CollectionCheckboxListProps) {
    return (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collections.map((collection) => (
                <label
                    key={collection.id}
                    htmlFor={collection.id}
                    className={`flex min-w-0 items-center gap-2 rounded-md px-2 py-2 ${
                        disabled
                            ? "cursor-default"
                            : "cursor-pointer hover:bg-muted/50 active:bg-muted"
                    }`}
                >
                    <Checkbox
                        id={collection.id}
                        checked={selectedIds.includes(collection.id)}
                        disabled={disabled}
                        onCheckedChange={(checked) =>
                            onChange(collection.id, checked === true)
                        }
                    />

                    <span className="truncate">
                        {collection.name}
                    </span>
                </label>
            ))}
        </div>
    );
}