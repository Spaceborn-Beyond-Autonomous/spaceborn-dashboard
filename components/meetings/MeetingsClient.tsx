'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Calendar, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMeetings } from '@/hooks/useMeetings';
import { useAttendance } from '@/hooks/useAttendance';
import MeetingCard from './MeetingCard';
import AttendanceOverview from './AttendanceOverview';
import EmptyState from './EmptyState';
import type { Meeting, MeetingCreate, MeetingUpdate } from '@/lib/types/meetings';
import type { User } from '@/lib/types/users';
import { listUsers } from '@/lib/api/users';
import { cn } from '@/lib/utils';

// Dynamic imports for modals to reduce initial bundle size
const MeetingModal = dynamic(() => import('./MeetingModal'), {
    ssr: false,
});

const AttendanceModal = dynamic(() => import('./AttendanceModal'), {
    ssr: false,
});

export default function MeetingsClient() {
    // Authentication check
    const { user: authUser } = useAuth();

    // Format user data
    const user: User | null = authUser ? {
        id: authUser.id,
        username: authUser.username,
        email: authUser.email,
        role: (authUser as any).role,
    } as User : null;

    const { meetings, addMeeting, editMeeting, removeMeeting } = useMeetings();
    const { attendanceCounts } = useAttendance(user?.role || '');

    const [showModal, setShowModal] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

    const [allUsers, setAllUsers] = useState<User[]>([]);

    // Authentication guard
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 animate-in fade-in duration-500">
                <div className="relative mb-8 group">
                    <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative w-24 h-24 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center shadow-2xl rotate-3 transition-transform duration-500 group-hover:rotate-6">
                        <Lock className="h-10 w-10 text-zinc-500 group-hover:text-red-400 transition-colors duration-300" />
                    </div>
                </div>
                <div className="max-w-md text-center space-y-3">
                    <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
                        Authentication Required
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        Please log in to view and manage meetings. Access is restricted to authorized personnel only.
                    </p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        listUsers()
            .then(users => setAllUsers(users))
            .catch(console.error);
    }, []);

    const handleOpenModal = (meeting?: Meeting) => {
        setEditingMeeting(meeting || null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingMeeting(null);
    };

    const handleOpenAttendanceModal = (meeting: Meeting) => {
        setSelectedMeeting(meeting);
        setShowAttendanceModal(true);
    };

    const handleCloseAttendanceModal = () => {
        setShowAttendanceModal(false);
        setSelectedMeeting(null);
    };

    const handleSaveMeeting = async (data: MeetingCreate | MeetingUpdate, id?: number): Promise<boolean> => {
        if (id !== undefined) {
            return await editMeeting(id, data as MeetingUpdate);
        } else {
            return await addMeeting(data as MeetingCreate);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl shadow-sm">
                        <Calendar className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Meetings</h1>
                        <p className="text-sm text-zinc-500">
                            Schedule, track, and manage team attendance.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    <span>New Meeting</span>
                </button>
            </div>

            {/* Attendance Overview (Admin/Core Only) */}
            {(user.role === 'admin' || user.role === 'core') && attendanceCounts.length > 0 && (
                <AttendanceOverview attendanceCounts={attendanceCounts} />
            )}

            {/* Content Area */}
            {!meetings || meetings.length === 0 ? (
                <EmptyState onCreateMeeting={() => handleOpenModal()} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {meetings.map((meeting) => (
                        <MeetingCard
                            key={meeting.id}
                            meeting={meeting}
                            userRole={user.role}
                            onEdit={handleOpenModal}
                            onDelete={removeMeeting}
                            onAttendance={handleOpenAttendanceModal}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {showModal && (
                <MeetingModal
                    meeting={editingMeeting}
                    onClose={handleCloseModal}
                    onSave={handleSaveMeeting}
                    allUsers={allUsers}
                />
            )}

            {showAttendanceModal && selectedMeeting && (
                <AttendanceModal
                    meeting={selectedMeeting}
                    onClose={handleCloseAttendanceModal}
                />
            )}
        </div>
    );
}