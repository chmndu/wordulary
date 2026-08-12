import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
    return (
        <div className="space-y-8">
            <section className="space-y-2">
                <Skeleton className="h-9 w-44" />
                <Skeleton className="h-5 w-72" />
            </section>

            <div className="rounded-xl border p-6">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-28" />
                </div>
            </div>

            <section className="space-y-3">
                <Skeleton className="h-4 w-24" />

                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-xl border p-4"
                    >
                        <Skeleton className="h-5 w-40" />

                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </section>
        </div>
    );
}