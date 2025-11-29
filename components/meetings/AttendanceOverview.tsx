'use client';

import { useMemo } from 'react';
import { UserAttendanceCount } from '@/lib/types/meetings';
import { Trophy, Users, TrendingUp, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceOverviewProps {
    attendanceCounts: UserAttendanceCount[];
}

export default function AttendanceOverview({ attendanceCounts }: AttendanceOverviewProps) {
    // 1. Calculate the maximum meetings attended to scale the progress bars relative to the top performer
    const maxMeetings = useMemo(() => {
        return Math.max(...attendanceCounts.map(u => u.meetings_joined), 1);
    }, [attendanceCounts]);

    // Helper to get initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className="mb-8 space-y-4">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-500" />
                        Attendance Overview
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                        Top active participants across all scheduled meetings.
                    </p>
                </div>
                {/* Optional: A subtle total counter */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>{attendanceCounts.length} active members</span>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendanceCounts.slice(0, 6).map((user, index) => {
                    // Calculate percentage relative to the top performer
                    const percentage = Math.round((user.meetings_joined / maxMeetings) * 100);
                    const isTopPerformer = index === 0;

                    return (
                        <div
                            key={user.user_id}
                            className="group relative flex flex-col justify-between bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Avatar with Initials */}
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold border",
                                        isTopPerformer
                                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                    )}>
                                        {getInitials(user.username)}
                                    </div>

                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
                                            {user.username}
                                        </p>
                                        <p className="text-xs text-zinc-500 truncate max-w-[140px]">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Rank/Trophy Icon for #1 */}
                                {isTopPerformer && (
                                    <div className="p-1.5 bg-amber-500/10 rounded-md">
                                        <Trophy className="h-4 w-4 text-amber-500" />
                                    </div>
                                )}
                            </div>

                            {/* Stats & Progress Bar */}
                            <div className="mt-2">
                                <div className="flex items-end justify-between mb-2">
                                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Joined
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <span className={cn(
                                            "text-2xl font-bold tabular-nums",
                                            isTopPerformer ? "text-amber-500" : "text-indigo-400"
                                        )}>
                                            {user.meetings_joined}
                                        </span>
                                        <span className="text-xs text-zinc-500">mtgs</span>
                                    </div>
                                </div>

                                {/* Relative Progress Bar */}
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-1000 ease-out",
                                            isTopPerformer ? "bg-amber-500" : "bg-indigo-500"
                                        )}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {attendanceCounts.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
                        <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                            <UserIcon className="h-6 w-6 text-zinc-600" />
                        </div>
                        <p className="text-zinc-400 font-medium">No attendance data yet</p>
                        <p className="text-sm text-zinc-600">Once meetings occur, stats will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}