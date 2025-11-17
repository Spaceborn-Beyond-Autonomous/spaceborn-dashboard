'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, X, Users, Clock, MapPin } from 'lucide-react';
import { listMeetings, createMeeting, updateMeeting, deleteMeeting, markAttendance, getMeetingAttendance, getUserAttendanceCounts } from '@/lib/api/meetings';
import type { Meeting, MeetingCreate, MeetingUpdate, MeetingAttendanceCreate, MeetingAttendanceRead, UserAttendanceCount } from '@/lib/types/meetings';
import { User } from '@/lib/types/users';


interface MeetingsClientProps {
    user: User;
    initialMeetings: Meeting[];
}

export default function MeetingsClient({ user, initialMeetings }: MeetingsClientProps) {
    const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
    const [showModal, setShowModal] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [attendance, setAttendance] = useState<MeetingAttendanceRead[]>([]);
    const [attendanceCounts, setAttendanceCounts] = useState<UserAttendanceCount[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        start_time: '',
        end_time: '',
        location: '',
        project_id: '',
    });
    const [attendanceForm, setAttendanceForm] = useState({
        user_ids: [] as number[],
    });

    useEffect(() => {
        if (user.role === 'admin' || user.role === 'core') {
            getUserAttendanceCounts().then(setAttendanceCounts).catch(console.error);
        }
    }, [user.role]);

    const handleOpenModal = (meeting?: Meeting) => {
        if (meeting) {
            setEditingMeeting(meeting);
            setFormData({
                title: meeting.title,
                description: meeting.description || '',
                date: meeting.date,
                start_time: meeting.start_time,
                end_time: meeting.end_time || '',
                location: meeting.location || '',
                project_id: meeting.project_id.toString(),
            });
        } else {
            setEditingMeeting(null);
            setFormData({
                title: '',
                description: '',
                date: '',
                start_time: '',
                end_time: '',
                location: '',
                project_id: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingMeeting(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = {
                ...formData,
                project_id: parseInt(formData.project_id),
            };

            if (editingMeeting) {
                await updateMeeting(editingMeeting.id, data);
            } else {
                await createMeeting(data);
            }

            // Refresh meetings
            const updatedMeetings = await listMeetings();
            setMeetings(updatedMeetings);

            handleCloseModal();
        } catch (error) {
            console.error('Failed to save meeting:', error);
        }
    };

    const handleDelete = async (meetingId: number) => {
        if (!confirm('Are you sure you want to delete this meeting?')) return;

        try {
            await deleteMeeting(meetingId);
            setMeetings(meetings.filter(m => m.id !== meetingId));
        } catch (error) {
            console.error('Failed to delete meeting:', error);
        }
    };

    const handleOpenAttendanceModal = async (meeting: Meeting) => {
        setSelectedMeeting(meeting);
        try {
            const attendanceData = await getMeetingAttendance(meeting.id);
            setAttendance(attendanceData);
            setShowAttendanceModal(true);
        } catch (error) {
            console.error('Failed to load attendance:', error);
        }
    };

    const handleMarkAttendance = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMeeting) return;

        try {
            await markAttendance(selectedMeeting.id, attendanceForm);
            const updatedAttendance = await getMeetingAttendance(selectedMeeting.id);
            setAttendance(updatedAttendance);
            setAttendanceForm({ user_ids: [] });
        } catch (error) {
            console.error('Failed to mark attendance:', error);
        }
    };

    const formatDateTime = (date: string, time: string) => {
        return new Date(`${date}T${time}`).toLocaleString();
    };

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Meetings</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-all"
                >
                    <Plus className="h-4 w-4" />
                    New Meeting
                </button>
            </div>

            {/* Attendance Counts for Admin/Core */}
            {(user.role === 'admin' || user.role === 'core') && attendanceCounts.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Attendance Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {attendanceCounts.slice(0, 6).map((count) => (
                            <div key={count.user_id} className="bg-[#111] border border-[#222] rounded p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">{count.username}</p>
                                        <p className="text-[#aaa] text-sm">{count.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{count.meetings_joined}</p>
                                        <p className="text-[#aaa] text-xs">meetings</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Meetings List */}
            {!meetings || meetings.length === 0 ? (
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
                            onClick={() => handleOpenModal()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition-all font-medium"
                        >
                            <Plus className="h-5 w-5" />
                            Schedule Meeting
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {meetings.map((meeting) => (
                        <div
                            key={meeting.id}
                            className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-black" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {meeting.title}
                                        </h3>
                                        <p className="text-[#aaa] text-sm">
                                            Project #{meeting.project_id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {meeting.description && (
                                <p className="text-sm text-[#aaa] mb-4 line-clamp-2">
                                    {meeting.description}
                                </p>
                            )}

                            <div className="space-y-2 text-xs text-[#aaa] mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDateTime(meeting.date, meeting.start_time)}</span>
                                </div>
                                {meeting.end_time && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        <span>Ends: {meeting.end_time}</span>
                                    </div>
                                )}
                                {meeting.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3" />
                                        <span>{meeting.location}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-[#222]">
                                <button
                                    onClick={() => handleOpenModal(meeting)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] rounded transition-all text-white text-sm"
                                >
                                    <Edit className="h-3 w-3" />
                                    Edit
                                </button>
                                {(user.role === 'admin' || user.role === 'core') && (
                                    <button
                                        onClick={() => handleOpenAttendanceModal(meeting)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] rounded transition-all text-white text-sm"
                                    >
                                        <Users className="h-3 w-3" />
                                        Attendance
                                    </button>
                                )}
                                {(user.role === 'admin' || user.role === 'core') && (
                                    <button
                                        onClick={() => handleDelete(meeting.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-red-500/20 rounded transition-all text-white text-sm"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Meeting Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111] border border-[#222] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">
                                {editingMeeting ? 'Edit Meeting' : 'New Meeting'}
                            </h3>
                            <button onClick={handleCloseModal}>
                                <X className="h-5 w-5 text-[#aaa] hover:text-white" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white resize-none"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={formData.start_time}
                                    onChange={(e) =>
                                        setFormData({ ...formData, start_time: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">
                                    End Time (Optional)
                                </label>
                                <input
                                    type="time"
                                    value={formData.end_time}
                                    onChange={(e) =>
                                        setFormData({ ...formData, end_time: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">
                                    Location (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({ ...formData, location: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                    placeholder="Conference Room A"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">
                                    Project ID
                                </label>
                                <input
                                    type="number"
                                    value={formData.project_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, project_id: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-all"
                                >
                                    {editingMeeting ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#222] transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Attendance Modal */}
            {showAttendanceModal && selectedMeeting && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111] border border-[#222] rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">
                                Attendance - {selectedMeeting.title}
                            </h3>
                            <button onClick={() => setShowAttendanceModal(false)}>
                                <X className="h-5 w-5 text-[#aaa] hover:text-white" />
                            </button>
                        </div>

                        {/* Current Attendance */}
                        <div className="mb-6">
                            <h4 className="text-white font-medium mb-3">Current Attendance</h4>
                            {attendance.length === 0 ? (
                                <p className="text-[#aaa] text-sm">No attendance recorded yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {attendance.map((att) => (
                                        <div key={att.id} className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded">
                                            <span className="text-white">User #{att.user_id}</span>
                                            <span className={`px-2 py-1 rounded text-xs ${att.attended ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {att.attended ? 'Present' : 'Absent'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mark Attendance Form */}
                        <form onSubmit={handleMarkAttendance} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">
                                    User IDs (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={attendanceForm.user_ids.join(', ')}
                                    onChange={(e) =>
                                        setAttendanceForm({
                                            user_ids: e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                    placeholder="1, 2, 3"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-all"
                            >
                                Mark Attendance
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
