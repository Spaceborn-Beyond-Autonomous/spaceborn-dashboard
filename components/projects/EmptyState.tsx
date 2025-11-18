// components/projects/EmptyState.tsx
import { FolderKanban, Plus } from 'lucide-react';

interface ProjectsEmptyStateProps {
    onCreate: () => void;
}

export function ProjectsEmptyState({ onCreate }: ProjectsEmptyStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <FolderKanban className="h-12 w-12 text-[#444]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                    No Projects Yet
                </h3>
                <p className="text-[#aaa] mb-8 leading-relaxed">
                    Get started by creating your first project. Track progress, manage
                    budgets, and collaborate with your team.
                </p>
                <button
                    onClick={onCreate}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition-all font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Create Your First Project
                </button>
            </div>
        </div>
    );
}
