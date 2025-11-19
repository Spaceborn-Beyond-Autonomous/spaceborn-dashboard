import { Users as UsersIcon } from 'lucide-react';

interface EmptyTeamsStateProps {
    onAddTeam?: () => void;
}

export default function EmptyTeamsState({ onAddTeam }: EmptyTeamsStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <UsersIcon className="h-16 w-16 text-[#aaa] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Teams Found</h3>
                <p className="text-[#aaa] mb-6">Get started by creating your first team.</p>
                {onAddTeam && (
                    <button
                        onClick={onAddTeam}
                        className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors font-medium"
                    >
                        Create Team
                    </button>
                )}
            </div>
        </div>
    );
}
