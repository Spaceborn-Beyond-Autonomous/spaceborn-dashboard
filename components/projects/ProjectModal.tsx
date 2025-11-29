import { useEffect } from 'react';
import { X, FolderKanban } from 'lucide-react';
import { Project, ProjectFormData } from '@/lib/types/projects';
import { ProjectForm } from './ProjectForm';
import { cn } from '@/lib/utils';

interface ProjectModalProps {
    isOpen: boolean;
    project: Project | null;
    onClose: () => void;
    onSubmit: (data: ProjectFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export function ProjectModal({ isOpen, project, onClose, onSubmit, isSubmitting }: ProjectModalProps) {

    // Close on Escape key press
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose} // Close when clicking backdrop
        >
            <div
                className={cn(
                    "w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50",
                    "animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" // Added flex-col and max-h
                )}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <FolderKanban className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-100">
                                {project ? 'Edit Project' : 'Create New Project'}
                            </h3>
                            <p className="text-xs text-zinc-500">
                                {project ? 'Update project details and configuration.' : 'Add a new project to your workspace.'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-2 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body with Modern Scrollbar */}
                <div className={cn(
                    "p-6 overflow-y-auto",
                    // Scrollbar Styles
                    "[&::-webkit-scrollbar]:w-2",
                    "[&::-webkit-scrollbar-track]:bg-zinc-900/50",
                    "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
                    "[&::-webkit-scrollbar-thumb]:rounded-full",
                    "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600",
                    "transition-all"
                )}>
                    <ProjectForm
                        project={project}
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}