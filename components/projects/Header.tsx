import { Plus } from 'lucide-react';

interface HeaderProps {
    onCreateNew: () => void;
}

export function Header({ onCreateNew }: HeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-6">
            <button
                onClick={onCreateNew}
                className="group inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95 whitespace-nowrap"
            >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                <span>New Project</span>
            </button>
        </div>
    );
}