export function LoadingState() {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse h-full">

                        {/* Header: Icon + Title/Tags */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 shrink-0" />
                            <div className="flex-1 space-y-2.5 py-0.5">
                                <div className="h-5 bg-zinc-800 rounded w-3/4" />
                                <div className="flex gap-2">
                                    <div className="h-5 w-20 bg-zinc-800/50 rounded-md" />
                                    <div className="h-5 w-14 bg-zinc-800/50 rounded-md" />
                                </div>
                            </div>
                        </div>

                        {/* Description Lines */}
                        <div className="space-y-2 mb-6">
                            <div className="h-3 bg-zinc-800/50 rounded w-full" />
                            <div className="h-3 bg-zinc-800/50 rounded w-5/6" />
                        </div>

                        {/* Progress Bar Section */}
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between">
                                <div className="h-3 w-24 bg-zinc-800/50 rounded" />
                                <div className="h-3 w-8 bg-zinc-800/50 rounded" />
                            </div>
                            <div className="h-2 w-full bg-zinc-800 rounded-full" />
                        </div>

                        {/* Team Info Placeholder */}
                        <div className="mb-6 p-2.5 rounded-lg border border-zinc-800/50 flex items-center gap-2.5">
                            <div className="h-8 w-8 bg-zinc-800 rounded-md shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-2 w-16 bg-zinc-800/50 rounded" />
                                <div className="h-2.5 w-24 bg-zinc-800 rounded" />
                            </div>
                        </div>

                        {/* Footer Dates */}
                        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-zinc-800/50 mt-auto">
                            <div className="space-y-1.5">
                                <div className="h-2.5 w-10 bg-zinc-800/50 rounded" />
                                <div className="h-3 w-20 bg-zinc-800 rounded" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-2.5 w-10 bg-zinc-800/50 rounded" />
                                <div className="h-3 w-20 bg-zinc-800 rounded" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <div className="h-9 flex-1 bg-zinc-800 rounded-lg" />
                            <div className="h-9 flex-1 bg-zinc-800/80 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}