'use client';

import { Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    onCreateMeeting: () => void;
}

export default function EmptyState({ onCreateMeeting }: EmptyStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[500px] p-6">
            <div className="text-center max-w-lg bg-zinc-950/50 border border-zinc-800 rounded-2xl p-12 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/10 group">
                {/* Visual Icon */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-900 border-4 border-zinc-800/70 flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-105">
                    <Calendar className="h-12 w-12 text-zinc-600 transition-colors duration-300 group-hover:text-indigo-500 group-hover:rotate-6" />
                </div>

                {/* Text Content */}
                <h3 className="2xl font-bold text-zinc-100 tracking-tight mb-3">
                    No Meetings Scheduled
                </h3>
                <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                    It looks quiet in here! Use the button below to schedule your first meeting and invite your team. All scheduled events will appear here.
                </p>

                {/* Action Button */}
                <button
                    onClick={onCreateMeeting}
                    className={cn(
                        "group inline-flex items-center gap-2 px-6 py-3",
                        "bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-base font-semibold",
                        "transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30",
                        "active:scale-[0.98]"
                    )}
                >
                    <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                    <span>Schedule New Meeting</span>
                </button>
            </div>
        </div>
    );
}