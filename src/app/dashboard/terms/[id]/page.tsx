import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GenerateAiContentButton } from "@/components/terms/generate-ai-content-button";
import { StatusSelector } from "@/components/terms/status-selector";
import { CollectionSelector } from "@/components/collections/collection-selector";
import { deleteTermAndRedirectAction } from "@/actions/terms";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import type { Metadata } from "next";
import { formatTermType } from "@/lib/terms/format-term-type";
import { Badge } from "@/components/ui/badge";

type PageProps = {
    params: Promise<{ id: string; }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            title: "Term",
        };
    }

    const { data: term } = await supabase
        .from("terms")
        .select("term")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    return {
        title: term?.term ?? "Term",
    };
}

export default async function TermPage({ params }: PageProps) {
    const { id } = await params;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        notFound();
    }

    const { data: term, error } =
        await supabase
            .from("terms")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

    if (error || !term) {
        notFound();
    }

    const { data: collections } =
        await supabase
            .from("collections")
            .select("id, name")
            .order("name");

    const { data: assignedCollections } =
        await supabase
            .from("term_collections")
            .select("collection_id")
            .eq("term_id", term.id);

    const selectedCollectionIds = assignedCollections?.map((item) => item.collection_id) ?? [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight wrap-break-word">
                    {term.term}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    {formatTermType(term.term_type)}
                </p>
            </div>

            <div className="rounded-xl border p-6 space-y-8">
                <div>
                    <StatusSelector
                        termId={term.id}
                        status={term.status}
                        aiGenerated={term.ai_generated}
                    />
                </div>

                <div>
                    <CollectionSelector
                        termId={term.id}
                        collections={collections ?? []}
                        selectedCollectionIds={selectedCollectionIds}
                    />
                </div>

                {!term.ai_generated ? (
                    <div className="space-y-4">
                        <p>
                            Generate details for this term.
                        </p>

                        <GenerateAiContentButton termId={term.id} />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground">
                                Definition
                            </h3>

                            <p className="mt-2 leading-7">
                                {term.definition}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground">
                                Examples
                            </h3>

                            <ul className="mt-2 list-disc space-y-2 pl-5">
                                {term.example_sentences?.map(
                                    (
                                        example: string,
                                        index: number
                                    ) => (
                                        <li key={index} className="leading-7">{example}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground">
                                Synonyms
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {term.synonyms?.map((synonym: string) => (
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
                                {term.antonyms?.map((antonym: string) => (
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
                                <Badge variant="secondary" className="capitalize">
                                    {term.difficulty}
                                </Badge>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-destructive">
                    Danger Zone
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Permanently delete this term.
                </p>

                <form
                    action={deleteTermAndRedirectAction}
                    className="mt-4"
                >
                    <input
                        type="hidden"
                        name="id"
                        value={term.id}
                    />

                    <ConfirmDeleteButton
                        label="Delete Term"
                        itemName={term.term}
                        itemType="Term"
                        variant="destructive"
                    />
                </form>
            </div>
        </div>
    );
}