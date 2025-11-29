'use client';

import { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Ensure this is imported
import { X, Calendar, Clock, Link as LinkIcon, User as UserIcon, AlignLeft, Bell, Search, Check, Loader2, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { Meeting, MeetingCreate, MeetingUpdate } from '@/lib/types/meetings';
import { User } from '@/lib/types/users';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MeetingModalProps {
    meeting: Meeting | null;
    onClose: () => void;
    onSave: (data: MeetingCreate | MeetingUpdate, id?: number) => Promise<boolean>;
    allUsers: User[];
}

interface FormData {
    title: string;
    agenda: string;
    date: Date | null;
    scheduled_at: string;
    attendees: number[];
    meeting_link: string;
    organizer: string;
    reminder_interval: string;
    notes: string;
}

export default function MeetingModal({ meeting, onClose, onSave, allUsers }: MeetingModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<FormData>({
        title: '',
        agenda: '',
        date: new Date(),
        scheduled_at: '09:00',
        attendees: [],
        meeting_link: '',
        organizer: '',
        reminder_interval: '15',
        notes: ''
    });

    // Generate 15-minute intervals for the time picker
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let i = 0; i < 24 * 4; i++) {
            const hour = Math.floor(i / 4);
            const minute = (i % 4) * 15;
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(time);
        }
        return slots;
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (meeting) {
            const scheduledDate = new Date(meeting.scheduled_at);
            const timeStr = scheduledDate.toTimeString().slice(0, 5);

            setFormData({
                title: meeting.title || '',
                agenda: meeting.agenda || '',
                date: scheduledDate,
                scheduled_at: timeStr,
                attendees: meeting.attendances?.map(a => a.user.id) || [],
                meeting_link: meeting.meeting_link || '',
                organizer: meeting.organizer || '',
                reminder_interval: meeting.reminder_interval?.toString() || '15',
                notes: meeting.notes || ''
            });
        } else {
            // Defaults
            const now = new Date();
            // Round to next 15 min
            const minutes = Math.ceil(now.getMinutes() / 15) * 15;
            now.setMinutes(minutes);

            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            setFormData({
                title: '',
                agenda: '',
                date: now,
                scheduled_at: timeStr,
                attendees: [],
                meeting_link: '',
                organizer: '',
                reminder_interval: '15',
                notes: ''
            });
        }
    }, [meeting]);

    const updateField = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleAttendee = (userId: number) => {
        setFormData(prev => ({
            ...prev,
            attendees: prev.attendees.includes(userId)
                ? prev.attendees.filter(id => id !== userId)
                : [...prev.attendees, userId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }
        if (!formData.date || !formData.scheduled_at) {
            toast.error('Date and time are required');
            return;
        }

        setIsSubmitting(true);

        try {
            // Combine Date object with Time string
            const datePart = formData.date.toISOString().split('T')[0];
            const combinedDateTime = `${datePart}T${formData.scheduled_at}:00`;
            const localDate = new Date(combinedDateTime);

            if (isNaN(localDate.getTime())) {
                toast.error('Invalid date or time');
                return;
            }

            const submitData: MeetingCreate | MeetingUpdate = {
                title: formData.title,
                agenda: formData.agenda || undefined,
                scheduled_at: localDate.toISOString(),
                attendees: formData.attendees,
                meeting_link: formData.meeting_link || undefined,
                organizer: formData.organizer || undefined,
                reminder_interval: parseInt(formData.reminder_interval, 10),
                notes: formData.notes || undefined
            };

            const success = meeting
                ? await onSave(submitData, meeting.id)
                : await onSave(submitData);

            if (success) {
                toast.success(meeting ? 'Meeting updated' : 'Meeting scheduled');
                onClose();
            }
        } catch (error) {
            console.error('Failed to save meeting:', error);
            toast.error('Failed to save meeting');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Custom Styles for React Datepicker to match Zinc Theme */}
            <style jsx global>{`
                .react-datepicker {
                    font-family: inherit;
                    background-color: #18181b; /* zinc-950 */
                    border: 1px solid #27272a; /* zinc-800 */
                    color: #f4f4f5;
                    border-radius: 0.75rem;
                    overflow: hidden;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
                }
                .react-datepicker__header {
                    background-color: #27272a; /* zinc-800 */
                    border-bottom: 1px solid #3f3f46;
                    padding-top: 1rem;
                }
                .react-datepicker__current-month {
                    color: #f4f4f5;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .react-datepicker__day-name {
                    color: #a1a1aa; /* zinc-400 */
                }
                .react-datepicker__day {
                    color: #f4f4f5;
                    border-radius: 0.375rem;
                    margin: 0.2rem;
                }
                .react-datepicker__day:hover {
                    background-color: #3f3f46; /* zinc-700 */
                }
                .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
                    background-color: #4f46e5 !important; /* indigo-600 */
                    color: white;
                }
                .react-datepicker__day--today {
                    font-weight: bold;
                    color: #818cf8; /* indigo-400 */
                }
                .react-datepicker__day--outside-month {
                    color: #52525b; /* zinc-600 */
                }
                .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before,
                .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::after {
                    border-bottom-color: #27272a;
                }
            `}</style>

            <div
                className={cn(
                    "w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh]",
                    "animate-in zoom-in-95 duration-200"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/30 shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-100">
                            {meeting ? 'Edit Meeting' : 'Schedule Meeting'}
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            {meeting ? 'Update meeting details and attendees.' : 'Create a new calendar event.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-100 transition-colors p-1 hover:bg-zinc-800 rounded-md"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className={cn(
                        "p-6 space-y-6 overflow-y-auto",
                        "[&::-webkit-scrollbar]:w-2",
                        "[&::-webkit-scrollbar-track]:bg-zinc-900/50",
                        "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
                        "[&::-webkit-scrollbar-thumb]:rounded-full",
                        "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
                    )}
                >
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Title <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => updateField('title', e.target.value)}
                            className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                            placeholder="e.g. Q4 Planning Sync"
                            required
                        />
                    </div>

                    {/* Date & Time Grid */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* Improved Date Picker with React-Datepicker */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Date
                            </label>
                            <div className="relative w-full">
                                <DatePicker
                                    selected={formData.date}
                                    onChange={(date) => updateField('date', date)}
                                    dateFormat="MMMM d, yyyy"
                                    className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all cursor-pointer"
                                    wrapperClassName="w-full"
                                    placeholderText="Select date"
                                    minDate={new Date()}
                                    showPopperArrow={false}
                                />
                                <div className="absolute right-3 top-2.5 pointer-events-none text-zinc-500">
                                    <ChevronRight className="h-4 w-4 rotate-90" />
                                </div>
                            </div>
                        </div>

                        {/* Improved Time Picker with Scrollable Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Time
                            </label>
                            <Select
                                value={formData.scheduled_at}
                                onValueChange={(val) => updateField('scheduled_at', val)}
                            >
                                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500/50">
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-100 h-60">
                                    {timeSlots.map((time) => (
                                        <SelectItem key={time} value={time} className="focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer">
                                            {time}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Agenda */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <AlignLeft className="h-3 w-3" /> Agenda
                        </label>
                        <textarea
                            value={formData.agenda}
                            onChange={e => updateField('agenda', e.target.value)}
                            className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none min-h-[80px]"
                            placeholder="Briefly describe the meeting agenda..."
                        />
                    </div>

                    {/* Attendees Selection */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <UserIcon className="h-3 w-3" /> Attendees
                            </label>
                            <span className="text-xs text-indigo-400 font-medium">{formData.attendees.length} selected</span>
                        </div>

                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden">
                            <div className="p-2 border-b border-zinc-800 flex items-center gap-2">
                                <Search className="h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-600 w-full"
                                />
                            </div>
                            <div className={cn(
                                "max-h-48 overflow-y-auto p-1 space-y-0.5",
                                "[&::-webkit-scrollbar]:w-1.5",
                                "[&::-webkit-scrollbar-track]:bg-zinc-900/30",
                                "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
                                "[&::-webkit-scrollbar-thumb]:rounded-full"
                            )}>
                                {filteredUsers.map(user => {
                                    const isSelected = formData.attendees.includes(user.id);
                                    return (
                                        <div
                                            key={user.id}
                                            onClick={() => toggleAttendee(user.id)}
                                            className={cn(
                                                "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors group",
                                                isSelected ? "bg-indigo-500/10" : "hover:bg-zinc-800/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                                                isSelected ? "bg-indigo-500 border-indigo-500" : "border-zinc-600 bg-zinc-900 group-hover:border-zinc-500"
                                            )}>
                                                {isSelected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={cn("text-sm font-medium leading-none", isSelected ? "text-indigo-200" : "text-zinc-300")}>{user.username}</span>
                                                <span className="text-[10px] text-zinc-500">{user.email}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredUsers.length === 0 && (
                                    <div className="p-4 text-center text-xs text-zinc-500">No users found</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Link & Organizer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <LinkIcon className="h-3 w-3" /> Link
                            </label>
                            <input
                                type="url"
                                value={formData.meeting_link}
                                onChange={e => updateField('meeting_link', e.target.value)}
                                className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                placeholder="https://meet.google.com/..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <UserIcon className="h-3 w-3" /> Organizer
                            </label>
                            <input
                                type="text"
                                value={formData.organizer}
                                onChange={e => updateField('organizer', e.target.value)}
                                className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                placeholder="Host name"
                            />
                        </div>
                    </div>

                    {/* Reminder - Replaced with Custom Select */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <Bell className="h-3 w-3" /> Reminder
                        </label>
                        <Select
                            value={formData.reminder_interval}
                            onValueChange={(val) => updateField('reminder_interval', val)}
                        >
                            <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500/50">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                                <SelectItem value="0">No reminder</SelectItem>
                                <SelectItem value="5">5 minutes before</SelectItem>
                                <SelectItem value="15">15 minutes before</SelectItem>
                                <SelectItem value="30">30 minutes before</SelectItem>
                                <SelectItem value="60">1 hour before</SelectItem>
                                <SelectItem value="1440">1 day before</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>{meeting ? 'Update Meeting' : 'Schedule Meeting'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}