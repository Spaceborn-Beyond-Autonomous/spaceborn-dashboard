import { Calendar, Plus } from 'lucide-react';

interface EmptyStateProps {
    onCreateMeeting: () => void;
}

export default function EmptyState({ onCreateMeeting }: EmptyStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-[#444]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                    No Meetings Yet
                </h3>
                <p className="text-[#aaa] mb-8 leading-relaxed">
                    Schedule your first meeting to get started with team collaboration.
                </p>
                <button
                    onClick={onCreateMeeting}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition-all font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Schedule Meeting
                </button>
            </div>
        </div>
    );
}
