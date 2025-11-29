import { AlertCircle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
    error: Error;
    onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 animate-in fade-in duration-500">

            {/* Visual Icon with Red Glow */}
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative w-20 h-20 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shadow-2xl group-hover:border-red-500/30 transition-all duration-300">
                    <AlertCircle className="h-10 w-10 text-red-500/80 group-hover:text-red-500 transition-colors" />
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-md text-center space-y-3 mb-8">
                <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
                    Failed to Load Projects
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed px-4 wrap-break-word">
                    {error.message || "We encountered an issue while retrieving your project data. Please check your connection and try again."}
                </p>
            </div>

            {/* Retry Button */}
            <button
                onClick={onRetry}
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg font-medium transition-all duration-200 shadow hover:shadow-zinc-500/20 hover:-translate-y-0.5 active:translate-y-0"
            >
                <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
                Try Again
            </button>
        </div>
    );
}