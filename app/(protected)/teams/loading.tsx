import TeamCardSkeleton from '@/components/teams/TeamCardSkeleton';

export default function Loading() {
    return (
        <main className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <TeamCardSkeleton key={i} />
                ))}
            </div>
        </main>
    );
}
