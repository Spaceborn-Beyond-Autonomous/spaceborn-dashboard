import { Plus, FolderKanban } from 'lucide-react';

interface HeaderProps {
    onCreateNew: () => void;
}

export function Header({ onCreateNew }: HeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl shadow-sm">
                    <FolderKanban className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Projects</h2>
                    <p className="text-sm text-zinc-500">Manage, track, and collaborate on your team's projects.</p>
                </div>
            </div>

            <button
                onClick={onCreateNew}
                className="group inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95"
            >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                <span>New Project</span>
            </button>
        </div>
    );
}