'use client';

import { useState, useMemo, useEffect } from 'react';
import { UserAttendanceCount } from '@/lib/types/meetings';
import { Trophy, Users, TrendingUp, User as UserIcon, ChevronRight, X, Search, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceOverviewProps {
    attendanceCounts: UserAttendanceCount[];
}

export default function AttendanceOverview({ attendanceCounts }: AttendanceOverviewProps) {
    const [isViewAllOpen, setIsViewAllOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isViewAllOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isViewAllOpen]);

    // 1. Calculate the maximum meetings attended to scale the progress bars
    const maxMeetings = useMemo(() => {
        return Math.max(...attendanceCounts.map(u => u.meetings_joined), 1);
    }, [attendanceCounts]);

    // Filter for the modal list
    const filteredAllUsers = useMemo(() => {
        return attendanceCounts.filter(u =>
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [attendanceCounts, searchTerm]);

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-500" />
                        Attendance Overview
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                        Top active participants across all scheduled meetings.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Active Members Counter */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-medium">
                        <TrendingUp className="h-3 w-3" />
                        <span>{attendanceCounts.length} active members</span>
                    </div>

                    {/* View All Button */}
                    <button
                        onClick={() => setIsViewAllOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors border border-zinc-700"
                    >
                        View Full Report
                        <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Grid Layout (Top 6) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendanceCounts.slice(0, 6).map((user, index) => {
                    const percentage = Math.round((user.meetings_joined / maxMeetings) * 100);
                    const isTopPerformer = index === 0;

                    return (
                        <div
                            key={user.user_id}
                            className="group relative flex flex-col justify-between bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
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

                                {isTopPerformer && (
                                    <div className="p-1.5 bg-amber-500/10 rounded-md">
                                        <Trophy className="h-4 w-4 text-amber-500" />
                                    </div>
                                )}
                            </div>

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

            {/* View All Modal */}
            {isViewAllOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsViewAllOpen(false)}
                >
                    <div
                        className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-100">Full Attendance Report</h3>
                                <p className="text-xs text-zinc-500">Complete list of all users and their meeting participation.</p>
                            </div>
                            <button
                                onClick={() => setIsViewAllOpen(false)}
                                className="p-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Search */}
                        <div className="p-4 border-b border-zinc-800 bg-zinc-900/20">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50"
                                />
                            </div>
                        </div>

                        {/* Modal List */}
                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                            {filteredAllUsers.length === 0 ? (
                                <div className="py-12 text-center text-zinc-500 text-sm">
                                    No users found matching "{searchTerm}"
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead className="text-xs font-medium text-zinc-500 uppercase tracking-wider sticky top-0 bg-zinc-950 z-10">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Rank</th>
                                            <th className="px-4 py-3 font-medium">User</th>
                                            <th className="px-4 py-3 font-medium text-right">Meetings</th>
                                            <th className="px-4 py-3 font-medium w-1/3">Activity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/50">
                                        {filteredAllUsers.map((user, index) => {
                                            // Recalculate rank based on full list index (approximate if searching)
                                            const rank = attendanceCounts.findIndex(u => u.user_id === user.user_id) + 1;
                                            const percentage = Math.round((user.meetings_joined / maxMeetings) * 100);

                                            let RankIcon = null;
                                            if (rank === 1) RankIcon = <Trophy className="h-4 w-4 text-amber-500" />;
                                            else if (rank === 2) RankIcon = <Medal className="h-4 w-4 text-zinc-300" />;
                                            else if (rank === 3) RankIcon = <Medal className="h-4 w-4 text-amber-700" />;

                                            return (
                                                <tr key={user.user_id} className="hover:bg-zinc-900/50 transition-colors group">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center w-6 h-6">
                                                            {RankIcon || <span className="text-xs text-zinc-600 font-mono">#{rank}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 border border-zinc-700/50">
                                                                {getInitials(user.username)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                                                                    {user.username}
                                                                </p>
                                                                <p className="text-xs text-zinc-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="text-sm font-bold text-zinc-300 tabular-nums">
                                                            {user.meetings_joined}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className={cn(
                                                                        "h-full rounded-full",
                                                                        rank === 1 ? "bg-amber-500" : "bg-indigo-500"
                                                                    )}
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] text-zinc-500 w-8 text-right tabular-nums">
                                                                {percentage}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}