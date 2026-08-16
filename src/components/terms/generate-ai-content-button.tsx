"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

type GenerateAiContentButtonProps = {
    termId: string;
};

export function GenerateAiContentButton({ termId }: GenerateAiContentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    async function handleGenerate() {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `/api/terms/${termId}/generate`,
                {
                    method: "POST",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Generation failed");
            }

            router.refresh();
            return;
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to generate AI content"
            );

            setLoading(false);
        }
    }

    return (
        <>
            <Button
                type="button"
                disabled={loading}
                onClick={handleGenerate}
            >
                {loading && <LoadingSpinner />}

                {loading ? "Generating..." : "Generate"}
            </Button>
            
            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}
        </>
    );
}