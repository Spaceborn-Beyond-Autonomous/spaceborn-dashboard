import { AlertCircle } from "lucide-react";

// components/projects/ErrorState.tsx
export function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
    return (
        <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center max-w-md">
                <div className="text-red-400 mb-4">
                    <AlertCircle className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Failed to Load Projects
                </h3>
                <p className="text-[#aaa] mb-6">{error.message}</p>
                <button
                    onClick={onRetry}
                    className="px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition-all"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}