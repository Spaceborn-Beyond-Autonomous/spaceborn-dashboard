import { Plus, FolderPlus } from 'lucide-react';

interface HeaderProps {
    onCreateNew: () => void;
}

export function Header({ onCreateNew }: HeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                    <FolderPlus className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent tracking-tight">
                        Missions
                    </h1>
                    <p className="text-sm text-zinc-500">Organized by topics and folders</p>
                </div>
            </div>
            
            <button
                onClick={onCreateNew}
                className="group inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95 whitespace-nowrap"
            >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                <span>New Projects</span>
            </button>
        </div>
    );
}
