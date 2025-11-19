import { X, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import type { Meeting, MeetingCreate, MeetingUpdate } from '@/lib/types/meetings';
import { User } from '@/lib/types/users';


interface MeetingModalProps {
    meeting: Meeting | null;
    onClose: () => void;
    onSave: (data: MeetingCreate | MeetingUpdate, id?: number) => Promise<boolean>;
    allUsers: User[];
}

interface FormData {
    title: string;
    agenda: string;
    date: string;          // ISO date string yyyy-mm-dd
    scheduled_at: string;  // time string HH:mm
    attendees: number[];   // array of user IDs
    meeting_link: string;
    organizer: string;
    reminder_interval: string; // keep as string for select input
    notes: string;
}

export default function MeetingModal({ meeting, onClose, onSave, allUsers }: MeetingModalProps) {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        agenda: '',
        date: '',
        scheduled_at: '',
        attendees: [],
        meeting_link: '',
        organizer: '',
        reminder_interval: '15',
        notes: ''
    });

    useEffect(() => {
        if (meeting) {
            setFormData({
                title: meeting.title || '',
                agenda: meeting.agenda || '',
                date: meeting.date || '',
                scheduled_at: meeting.scheduled_at || '',
                attendees: meeting.attendees || [],
                meeting_link: meeting.meeting_link || '',
                organizer: meeting.organizer || '',
                reminder_interval: meeting.reminder_interval.toString(),
                notes: meeting.notes || ''
            });
        } else {
            setFormData({
                title: '',
                agenda: '',
                date: '',
                scheduled_at: '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const submitData: MeetingCreate | MeetingUpdate = {
            ...formData,
            reminder_interval: parseInt(formData.reminder_interval, 10)
        };

        const success = meeting
            ? await onSave(submitData, meeting.id)
            : await onSave(submitData);

        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-[#222] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">
                        {meeting ? 'Edit Meeting' : 'Schedule New Meeting'}
                    </h3>
                    <button onClick={onClose} className="hover:bg-[#222] rounded-full p-1 transition-colors">
                        <X className="h-5 w-5 text-[#aaa] hover:text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-[#aaa] mb-2">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => updateField('title', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#222] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                            placeholder="Enter meeting title"
                            required
                        />
                    </div>

                    {/* Agenda */}
                    <div>
                        <label className="block text-sm font-medium text-[#aaa] mb-2">Agenda</label>
                        <textarea
                            value={formData.agenda}
                            onChange={e => updateField('agenda', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#222] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white resize-none transition-colors"
                            rows={3}
                            placeholder="What will be discussed?"
                        />
                    </div>

                    {/* Date and Time Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#aaa] mb-2">
                                Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => updateField('date', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#aaa] mb-2">
                                Scheduled Time <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="time"
                                value={formData.scheduled_at}
                                onChange={e => updateField('scheduled_at', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Attendees */}
                    <div>
                        <label className="block text-sm font-medium text-[#aaa] mb-2">Attendees</label>
                        <Select
                            isMulti
                            options={allUsers.map(user => ({
                                value: user.id,
                                label: `${user.username} (${user.email})`
                            }))}
                            value={allUsers
                                .filter(user => formData.attendees.includes(user.id))
                                .map(user => ({
                                    value: user.id,
                                    label: `${user.username} (${user.email})`
                                }))}
                            onChange={selectedOptions => {
                                updateField(
                                    'attendees',
                                    selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                );
                            }}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select attendees..."
                        />
                    </div>

                    {/* Meeting Link */}
                    <div>
                        <label className="block text-sm font-medium text-[#aaa] mb-2">Meeting Link</label>
                        <input
                            type="url"
                            value={formData.meeting_link}
                            onChange={e => updateField('meeting_link', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#222] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                            placeholder="https://meet.google.com/..."
                        />
                    </div>

                    {/* Organizer and Reminder Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#aaa] mb-2">Organizer</label>
                            <input
                                type="text"
                                value={formData.organizer}
                                onChange={e => updateField('organizer', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#222] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                                placeholder="Organizer name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#aaa] mb-2">Reminder</label>
                            <select
                                value={formData.reminder_interval}
                                onChange={e => updateField('reminder_interval', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                            >
                                <option value="0">No reminder</option>
                                <option value="5">5 minutes before</option>
                                <option value="15">15 minutes before</option>
                                <option value="30">30 minutes before</option>
                                <option value="60">1 hour before</option>
                                <option value="1440">1 day before</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-[#aaa] mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => updateField('notes', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#222] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white resize-none transition-colors"
                            rows={4}
                            placeholder="Additional notes or details..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all"
                        >
                            {meeting ? 'Update Meeting' : 'Create Meeting'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-[#1a1a1a] border border-[#222] text-white rounded-lg font-medium hover:bg-[#222] transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
