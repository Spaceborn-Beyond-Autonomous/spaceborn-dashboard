// components/projects/LoadingState.tsx
export function LoadingState() {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-[#111] border border-[#222] rounded p-6 animate-pulse">
                        <div className="h-10 w-10 bg-[#222] rounded-full mb-4" />
                        <div className="h-4 bg-[#222] rounded w-3/4 mb-2" />
                        <div className="h-3 bg-[#222] rounded w-full mb-4" />
                        <div className="h-2 bg-[#222] rounded w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}


