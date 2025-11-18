// components/projects/Header.tsx
import { Plus } from 'lucide-react';

interface HeaderProps {
    onCreateNew: () => void;
}

export function Header({ onCreateNew }: HeaderProps) {
    return (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">All Projects</h2>
            <button
                onClick={onCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-all"
            >
                <Plus className="h-4 w-4" />
                New Project
            </button>
        </div>
    );
}
