export default function TeamCardSkeleton() {
    return (
        <div className="flex flex-col p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse h-full">

            {/* Header: Icon + Title */}
            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-5 bg-zinc-800 rounded w-1/2" />
                    <div className="h-3 bg-zinc-800/50 rounded w-1/3" />
                </div>
            </div>

            <div className="space-y-6">
                {/* Team Lead Section */}
                <div className="space-y-2">
                    <div className="h-2.5 w-16 bg-zinc-800 rounded" /> {/* Label */}
                    <div className="flex items-center gap-3 p-2 rounded-lg border border-zinc-800/50 bg-zinc-900/20">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-24 bg-zinc-800 rounded" />
                            <div className="h-2 w-32 bg-zinc-800/50 rounded" />
                        </div>
                    </div>
                </div>

                {/* Members Section */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <div className="h-2.5 w-16 bg-zinc-800 rounded" /> {/* Label */}
                        <div className="h-2 w-10 bg-zinc-800/50 rounded" /> {/* Count */}
                    </div>

                    <div className="flex items-center pl-2 h-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 -ml-2"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}