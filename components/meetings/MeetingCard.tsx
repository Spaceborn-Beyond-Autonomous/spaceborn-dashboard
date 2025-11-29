'use client';

import { Calendar, Edit, Trash2, Users, Clock, Link as LinkIcon, Bell, StickyNote, CheckCircle, CircleDot } from 'lucide-react';
import type { Meeting } from '@/lib/types/meetings';
import { cn } from '@/lib/utils'; // Assuming cn utility is available

interface MeetingCardProps {
    meeting: Meeting;
    userRole: string;
    onEdit: (meeting: Meeting) => void;
    onDelete: (id: number) => void;
    onAttendance: (meeting: Meeting) => void;
}

export default function MeetingCard({
    meeting,
    userRole,
    onEdit,
    onDelete,
    onAttendance,
}: MeetingCardProps) {
    const meetingDate = new Date(meeting.scheduled_at);
    const now = new Date();
    const isUpcoming = meetingDate > now;
    const isAdminOrCore = userRole === 'admin' || userRole === 'core';

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Show relative time if within 24 hours (and is upcoming)
        if (isUpcoming && diffInHours > 0 && diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            const minutes = Math.floor((diffInHours - hours) * 60);
            return `In ${hours}h ${minutes}m`;
        }

        // Otherwise show full date/time
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getReminderText = (minutes: number) => {
        if (minutes === 0) return 'No reminder set';
        if (minutes < 60) return `${minutes} minutes before`;
        if (minutes === 60) return '1 hour before';
        if (minutes === 1440) return '1 day before';
        return `${minutes} minutes before`;
    };

    return (
        <div className="group flex flex-col justify-between bg-zinc-950 border border-zinc-800 rounded-xl p-6 transition-all duration-300 shadow-xl shadow-black/20 hover:border-indigo-600/50 hover:shadow-indigo-900/20">

            {/* Header and Status */}
            <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center shrink-0">
                            <Calendar className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-100 leading-snug">
                                {meeting.title}
                            </h3>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shrink-0 mt-1",
                        isUpcoming
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-zinc-700/30 text-zinc-500 border border-zinc-700"
                    )}>
                        {isUpcoming ? (
                            <>
                                <CircleDot className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500/30" />
                                <span>Upcoming</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-2.5 w-2.5" />
                                <span>Completed</span>
                            </>
                        )}
                    </div>
                </div>

                {meeting.organizer && (
                    <p className="text-sm text-zinc-500 ml-[52px]">
                        Organized by <span className="text-zinc-400">{meeting.organizer}</span>
                    </p>
                )}
            </div>

            {/* Agenda */}
            {meeting.agenda && (
                <p className="text-sm text-zinc-400 mb-5 line-clamp-3">
                    {meeting.agenda}
                </p>
            )}

            {/* Details Grid */}
            <div className="space-y-3 text-sm text-zinc-500 mb-6">
                <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-indigo-400" />
                    <span className="text-zinc-300 font-medium">{formatDateTime(meeting.scheduled_at)}</span>
                </div>

                {meeting.attendances && (
                    <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 shrink-0 text-indigo-400" />
                        <span>
                            <span className="font-medium text-zinc-300">{meeting.attendances.length}</span> attendee{meeting.attendances.length !== 1 ? 's' : ''} invited
                        </span>
                    </div>
                )}

                {meeting.meeting_link && (
                    <div className="flex items-center gap-3">
                        <LinkIcon className="h-4 w-4 shrink-0 text-indigo-400" />
                        <a
                            href={meeting.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 transition-colors truncate text-xs font-mono"
                        >
                            {/* Display meeting domain or a generic join link */}
                            {meeting.meeting_link.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] || 'Meeting Link'}
                        </a>
                    </div>
                )}

                {meeting.reminder_interval > 0 && (
                    <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 shrink-0 text-indigo-400" />
                        <span>{getReminderText(meeting.reminder_interval)}</span>
                    </div>
                )}

                {meeting.notes && (
                    <div className="flex items-start gap-3 pt-3 border-t border-zinc-800/50">
                        <StickyNote className="h-4 w-4 shrink-0 mt-0.5 text-zinc-600" />
                        <span className="text-zinc-500 line-clamp-2 italic text-xs">
                            Notes: {meeting.notes}
                        </span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-zinc-800 shrink-0">
                {/* Edit Button */}
                <button
                    onClick={() => onEdit(meeting)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all text-white text-sm font-medium shadow-md shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-50"
                    disabled={!isAdminOrCore}
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </button>

                {isAdminOrCore && (
                    <>
                        {/* Attendance Button */}
                        <button
                            onClick={() => onAttendance(meeting)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all text-zinc-300 text-sm font-medium border border-zinc-700 active:scale-[0.99]"
                        >
                            <Users className="h-4 w-4" />
                            Attendance
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={() => onDelete(meeting.id)}
                            className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-red-500/20 rounded-lg transition-all text-zinc-400 hover:text-red-400 border border-zinc-700 active:scale-[0.99] shrink-0"
                            title="Delete Meeting"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}