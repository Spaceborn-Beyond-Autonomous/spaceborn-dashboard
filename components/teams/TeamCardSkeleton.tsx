export default function TeamCardSkeleton() {
    return (
        <div className="bg-[#111] border border-[#222] rounded p-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#222]" />
                <div className="h-5 bg-[#222] rounded w-32" />
            </div>

            {/* Team lead skeleton */}
            <div className="mb-4 p-3 bg-[#1a1a1a] rounded border border-[#333]">
                <div className="h-3 bg-[#222] rounded w-16 mb-2" />
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#222]" />
                    <div className="h-4 bg-[#222] rounded w-24" />
                </div>
            </div>

            {/* Members skeleton */}
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#222]" />
                            <div className="h-4 bg-[#222] rounded w-28" />
                        </div>
                        <div className="h-5 bg-[#222] rounded w-16" />
                    </div>
                ))}
            </div>

            {/* Footer skeleton */}
            <div className="mt-4 pt-4 border-t border-[#222]">
                <div className="h-3 bg-[#222] rounded w-20" />
            </div>
        </div>
    );
}
