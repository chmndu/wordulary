"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";
import { CollectionCheckboxList } from "../collections/collection-checkbox-list";

type ImportTermsFormProps = {
    collections: {
        id: string;
        name: string;
    }[];
};

export function ImportTermsForm({ collections }: ImportTermsFormProps) {
    const [termsText, setTermsText] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

    async function handleImport() {
        const terms = termsText
            .split("\n")
            .map((term) => term.trim())
            .filter(Boolean);

        if (terms.length === 0) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setMessage(null);

            const response = await fetch(
                "/api/import-terms",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        terms,
                        collectionIds: selectedCollectionIds,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Import failed");
            }

            const importedLabel =
                data.imported === 1
                    ? "term"
                    : "terms";

            const duplicateLabel =
                data.duplicates === 1
                    ? "duplicate"
                    : "duplicates";

            const invalidLabel =
                data.invalid === 1
                    ? "invalid entry"
                    : "invalid entries";

            const messages = [
                `Successfully imported ${data.imported} ${importedLabel}.`,
            ];

            if (data.duplicates > 0) {
                messages.push(
                    `Skipped ${data.duplicates} ${duplicateLabel}.`
                );
            }

            if (data.invalid > 0) {
                messages.push(
                    `Skipped ${data.invalid} ${invalidLabel}.`
                );
            }

            const message = messages.join(" ");

            setMessage(message);
            setTermsText("");
            setSelectedCollectionIds([]);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Import failed");
        } finally {
            setLoading(false);
        }
    }

    function handleCollectionChange(
        collectionId: string,
        checked: boolean
    ) {
        if (checked) {
            setSelectedCollectionIds((current) => [
                ...current,
                collectionId,
            ]);

            return;
        }

        setSelectedCollectionIds((current) =>
            current.filter((id) => id !== collectionId)
        );
    }

    return (
        <section className="space-y-4">
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        Vocabulary List
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Enter one word, phrase, or idiom per line.
                    </p>
                </div>

                <div className="space-y-3">
                    <Textarea
                        value={termsText}
                        onChange={(event) =>
                            setTermsText(
                                event.target.value
                            )
                        }
                        placeholder="Enter one term per line"
                        className="min-h-[250px]"
                    />

                    <Button
                        type="button"
                        className="w-full sm:w-auto"
                        onClick={handleImport}
                        disabled={loading}
                    >
                        {loading && <LoadingSpinner />}

                        {loading ? "Importing..." : "Import Terms"}
                    </Button>
                </div>
            </div>

            {message && (
                <SuccessMessage>
                    {message}
                </SuccessMessage>
            )}

            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}

            {collections.length > 0 && (
                <div className="mt-6 space-y-4 border-t pt-6">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Collections (optional)
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Choose one or more collections for the imported terms.
                        </p>
                    </div>

                    <CollectionCheckboxList
                        collections={collections}
                        selectedIds={selectedCollectionIds}
                        disabled={loading}
                        onChange={handleCollectionChange}
                    />
                </div>
            )}
        </section>
    );
}