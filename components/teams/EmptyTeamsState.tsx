import { Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyTeamsStateProps {
    onAddTeam?: () => void;
}

export default function EmptyTeamsState({ onAddTeam }: EmptyTeamsStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 animate-in fade-in duration-500">

            {/* Visual Icon with Indigo Glow */}
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative w-24 h-24 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center shadow-2xl rotate-3 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105 group-hover:border-zinc-700">
                    <Users className="h-10 w-10 text-zinc-500 group-hover:text-indigo-400 transition-colors duration-300" />
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-md text-center space-y-3 mb-8">
                <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
                    No Teams Found
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                    Your workspace currently has no teams. Create your first team to start organizing members and assigning projects.
                </p>
            </div>

            {/* CTA Button */}
            {onAddTeam && (
                <button
                    onClick={onAddTeam}
                    className="group relative inline-flex items-center gap-2.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 hover:-translate-y-0.5"
                >
                    <div className="bg-indigo-500/50 rounded-md p-0.5 group-hover:bg-indigo-400/50 transition-colors">
                        <Plus className="h-4 w-4" />
                    </div>
                    Create Team
                </button>
            )}
        </div>
    );
}