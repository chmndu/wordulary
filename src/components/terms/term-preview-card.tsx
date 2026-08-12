import type { GeneratedTerm } from "@/types/term";

type TermPreviewCardProps = {
    generatedTerm: GeneratedTerm;
};

export function TermPreviewCard({
    generatedTerm,
}: TermPreviewCardProps) {
    return (
        <div className="rounded-xl border p-6 space-y-8">
            <div>
                <h3 className="text-3xl font-semibold tracking-tight">
                    {generatedTerm.term}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground capitalize">
                    {generatedTerm.termType}
                </p>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                    Definition
                </h3>

                <p className="mt-2 leading-7">
                    {generatedTerm.definition}
                </p>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                    Example Sentences
                </h3>

                <ul className="mt-2 list-disc space-y-2 pl-5">
                    {generatedTerm.exampleSentences.map(
                        (sentence) => (
                            <li key={sentence}>
                                {sentence}
                            </li>
                        )
                    )}
                </ul>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                    Synonyms
                </h3>

                <p className="mt-2 leading-7">
                    {generatedTerm.synonyms.join(", ")}
                </p>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                    Antonyms
                </h3>

                <p className="mt-2 leading-7">
                    {generatedTerm.antonyms.join(", ")}
                </p>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                    Difficulty
                </h3>

                <p className="mt-2 leading-7 capitalize">
                    {generatedTerm.difficulty}
                </p>
            </div>
        </div>
    );
}