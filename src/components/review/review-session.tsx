"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle2 } from "lucide-react";

type ReviewTerm = {
    id: string;
    term: string;
    definition: string | null;
    example_sentences: string[] | null;
};

type ReviewSessionProps = {
    terms: ReviewTerm[];
    collectionId?: string;
};

export function ReviewSession({ terms, collectionId }: ReviewSessionProps) {
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [masteredIds, setMasteredIds] = useState<string[]>([]);

    const currentTerm = terms[currentIndex];

    const isLastTerm = currentIndex === terms.length - 1;

    function handleNext() {
        setCurrentIndex((current) =>
            current + 1
        );

        setShowAnswer(false);
    }

    async function handleMarkMastered() {
        if (isMastered) {
            return;
        }

        try {
            setUpdating(true);

            const response = await fetch(
                `/api/terms/${currentTerm.id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "mastered" }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update status");
            }

            setMasteredIds((current) => [
                ...current,
                currentTerm.id,
            ]);

            handleNext();
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(false);
        }
    }

    function handlePrevious() {
        if (currentIndex === 0) {
            return;
        }

        setCurrentIndex((current) => current - 1);

        setShowAnswer(false);
    }

    if (!currentTerm) {
        return (
            <section className="rounded-xl border p-8 text-center">
                <h2 className="text-xl font-semibold">
                    Review Complete
                </h2>

                <p className="mt-2 text-sm text-muted-foreground mb-4">
                    You&apos;ve reviewed all available terms.
                </p>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        window.location.href =
                            collectionId
                                ? `/dashboard/review?collection=${collectionId}`
                                : "/dashboard/review";
                    }}
                >
                    Start Over
                </Button>
            </section>
        );
    }

    const isMastered = masteredIds.includes(currentTerm.id);

    return (
        <section className="space-y-6">
            <p className="text-sm text-muted-foreground">
                {currentIndex + 1} of {terms.length} • {masteredIds.length} mastered
            </p>

            <h2 className="text-3xl font-semibold">
                {currentTerm.term}
            </h2>

            {!showAnswer ? (
                <Button
                    type="button"
                    onClick={() => setShowAnswer(true)}
                >
                    Show Definition
                </Button>
            ) : null}

            {showAnswer && (
                <div className="rounded-xl border p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Definition
                        </h3>

                        <p className="mt-2 leading-7">
                            {currentTerm.definition}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Examples
                        </h3>

                        <ul className="mt-2 list-disc space-y-2 pl-5">
                            {currentTerm.example_sentences?.map(
                                (example, index) => (
                                    <li key={index} className="leading-7">
                                        {example}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        {currentIndex > 0 && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handlePrevious}
                            >
                                Previous
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleNext}
                        >
                            {isLastTerm ? "Finish Review" : "Next Term"}
                        </Button>

                        {isMastered ? (
                            <p className="self-center flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-success">
                                <CheckCircle2 className="size-4" />
                                Mastered
                            </p>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleMarkMastered}
                                disabled={updating}
                            >
                                {updating ? (
                                    <>
                                        <LoadingSpinner />
                                        Marking...
                                    </>
                                ) : isLastTerm ? (
                                    "Mark Mastered & Finish"
                                ) : (
                                    "Mark Mastered"
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}