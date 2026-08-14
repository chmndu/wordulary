"use client";

import { useState } from "react";
import type { GeneratedTerm } from "@/types/term";
import { TermPreviewCard } from "@/components/terms/term-preview-card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorMessage } from "@/components/ui/error-message";

type TermGeneratorProps = {
    collections: {
        id: string;
        name: string;
    }[];
};

export function TermGenerator({ collections }: TermGeneratorProps) {
    const [generatedTerm, setGeneratedTerm] = useState<GeneratedTerm | null>(null);
    const [term, setTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [generateError, setGenerateError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

    const router = useRouter();

    const isRegenerate = generatedTerm &&
        term.trim().toLowerCase() ===
        generatedTerm.term.trim().toLowerCase();

    async function handleGenerate() {
        if (!term.trim()) {
            return;
        }

        try {
            setGenerateError(null);
            setSaveError(null);

            setLoading(true);

            const normalizedTerm = term.trim().toLowerCase();

            const response = await fetch("/api/generate-term", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    term: normalizedTerm,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                throw new Error(errorData.error ?? "Failed to generate term");
            }

            const generatedTerm = await response.json();

            setGeneratedTerm(generatedTerm);
            setTerm(normalizedTerm);

            setGenerateError(null);
            setSaveError(null);
        } catch (error) {
            console.error(error);
            setGenerateError(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!generatedTerm) {
            return;
        }

        try {
            setSaving(true);
            setSaveError(null);

            const response =
                await fetch(
                    "/api/save-term",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...generatedTerm,
                            term: term.trim().toLowerCase(),
                            collectionIds: selectedCollectionIds,
                        }),
                    }
                );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Save failed");
            }

            router.push("/dashboard/terms");
        } catch (error) {
            console.error(error);
            setSaveError(error instanceof Error ? error.message : "Failed to save term");
        } finally {
            setSaving(false);
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
        <section>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handleGenerate();
                }}
            >
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                        type="text"
                        value={term}
                        onChange={(event) => {
                            setTerm(event.target.value);

                            setGenerateError(null);
                            setSaveError(null);
                        }}
                        placeholder="Enter a word, phrase, or idiom"
                    />

                    <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={loading || saving}
                    >
                        {loading && <LoadingSpinner />}

                        {loading
                            ? "Generating..."
                            : isRegenerate
                                ? "Regenerate"
                                : "Generate"}
                    </Button>
                </div>
            </form>

            {generateError && (
                <ErrorMessage className="mt-3">
                    {generateError}
                </ErrorMessage>
            )}

            {generatedTerm && (
                <div className="mt-8 space-y-6">
                    <TermPreviewCard
                        generatedTerm={generatedTerm}
                    />

                    {collections.length > 0 && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Collections (optional)
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Choose one or more collections for this term.
                                </p>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {collections.map((collection) => (
                                    <label
                                        key={collection.id}
                                        htmlFor={collection.id}
                                        className="flex min-w-0 cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/50 active:bg-muted"
                                    >
                                        <Checkbox
                                            id={collection.id}
                                            checked={selectedCollectionIds.includes(collection.id)}
                                            disabled={loading || saving}
                                            onCheckedChange={(checked) =>
                                                handleCollectionChange(
                                                    collection.id,
                                                    checked === true
                                                )
                                            }
                                        />

                                        <span className="truncate">{collection.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSave();
                        }}
                        className="space-y-3"
                    >
                        {saveError && (
                            <ErrorMessage>
                                {saveError}
                            </ErrorMessage>
                        )}

                        <Button
                            type="submit"
                            disabled={saving || loading}
                        >
                            {saving && <LoadingSpinner />}

                            {saving ? "Saving..." : "Save Term"}
                        </Button>
                    </form>
                </div>

            )}
        </section>
    );
}