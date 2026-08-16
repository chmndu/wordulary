import { formatTermType } from "@/lib/terms/format-term-type";
import type { GeneratedTerm } from "@/types/term";
import { Badge } from "../ui/badge";

type TermPreviewCardProps = {
    generatedTerm: GeneratedTerm;
};

export function TermPreviewCard({
    generatedTerm,
}: TermPreviewCardProps) {
    return (
        <div className="rounded-xl border p-6 space-y-8">
            <div>
                <h3 className="text-3xl font-semibold tracking-tight wrap-break-word">
                    {generatedTerm.term}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    {formatTermType(generatedTerm.termType)}
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

                <div className="mt-3 flex flex-wrap gap-2">
                    {generatedTerm.synonyms.map((synonym) => (
                        <Badge
                            key={synonym}
                            variant="secondary"
                            className="h-7 px-3 text-sm font-medium"
                        >
                            {synonym}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                    Antonyms
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                    {generatedTerm.antonyms.map((antonym) => (
                        <Badge
                            key={antonym}
                            variant="outline"
                            className="h-7 px-3 text-sm font-medium"
                        >
                            {antonym}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                    Difficulty
                </h3>

                <div className="mt-2">
                    <Badge
                        variant="secondary"
                        className="capitalize"
                    >
                        {generatedTerm.difficulty}
                    </Badge>
                </div>
            </div>
        </div>
    );
}