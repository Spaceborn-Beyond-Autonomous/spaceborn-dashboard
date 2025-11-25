import { Calendar, Edit, Trash2, Users, Clock, Link2, Bell, StickyNote } from 'lucide-react';
import type { Meeting } from '@/lib/types/meetings';

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
    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Show relative time if within 24 hours
        if (diffInHours > 0 && diffInHours < 24) {
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
        if (minutes === 0) return 'No reminder';
        if (minutes < 60) return `${minutes} min before`;
        if (minutes === 60) return '1 hour before';
        if (minutes === 1440) return '1 day before';
        return `${minutes} min before`;
    };

    const isAdminOrCore = userRole === 'admin' || userRole === 'core';

    return (
        <div className="bg-[#111] border border-[#222] rounded-lg p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-black" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {meeting.title}
                        </h3>
                        {meeting.organizer && (
                            <p className="text-[#aaa] text-sm">
                                Organized by {meeting.organizer}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {meeting.agenda && (
                <p className="text-sm text-[#aaa] mb-4 line-clamp-2">
                    {meeting.agenda}
                </p>
            )}

            <div className="space-y-2 text-xs text-[#aaa] mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>{formatDateTime(meeting.scheduled_at)}</span>
                </div>
                {meeting.attendances && meeting.attendances.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 shrink-0" />
                        <span>{meeting.attendances.length} attendee{meeting.attendances.length !== 1 ? 's' : ''}</span>
                    </div>
                )}
                {meeting.meeting_link && (
                    <div className="flex items-center gap-2">
                        <Link2 className="h-3 w-3 shrink-0" />
                        <a
                            href={meeting.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors truncate"
                        >
                            Join meeting
                        </a>
                    </div>
                )}
                {meeting.reminder_interval > 0 && (
                    <div className="flex items-center gap-2">
                        <Bell className="h-3 w-3 shrink-0" />
                        <span>{getReminderText(meeting.reminder_interval)}</span>
                    </div>
                )}
                {meeting.notes && (
                    <div className="flex items-start gap-2">
                        <StickyNote className="h-3 w-3 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{meeting.notes}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-[#222]">
                <button
                    onClick={() => onEdit(meeting)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] rounded transition-all text-white text-sm"
                >
                    <Edit className="h-3 w-3" />
                    Edit
                </button>
                {isAdminOrCore && (
                    <>
                        <button
                            onClick={() => onAttendance(meeting)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] rounded transition-all text-white text-sm"
                        >
                            <Users className="h-3 w-3" />
                            Attendance
                        </button>
                        <button
                            onClick={() => onDelete(meeting.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-red-500/20 rounded transition-all text-white text-sm"
                        >
                            <Trash2 className="h-3 w-3" />
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
