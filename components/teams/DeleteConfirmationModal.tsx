'use client';

import { useEffect } from 'react';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    teamName: string;
    isDeleting: boolean;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    teamName,
    isDeleting,
}: DeleteConfirmationModalProps) {

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isDeleting) onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose, isDeleting]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={!isDeleting ? onClose : undefined}
        >
            <div
                className={cn(
                    "w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 p-6",
                    "animate-in zoom-in-95 duration-200"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-100">Delete Team</h2>
                            <p className="text-xs text-zinc-500">This action cannot be undone.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="text-zinc-500 hover:text-zinc-100 transition-colors p-1 hover:bg-zinc-800 rounded-md disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
                    <p className="text-sm text-zinc-400">
                        Are you sure you want to permanently delete the team <span className="text-zinc-100 font-semibold break-all">"{teamName}"</span>?
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">
                        All associated members will be unassigned from this team.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            'Delete Team'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}