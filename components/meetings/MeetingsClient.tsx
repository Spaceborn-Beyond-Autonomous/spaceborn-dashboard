'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMeetings } from '@/hooks/useMeetings';
import { useAttendance } from '@/hooks/useAttendance';
import MeetingCard from './MeetingCard';
import AttendanceOverview from './AttendanceOverview';
import EmptyState from './EmptyState';
import type { Meeting, MeetingCreate, MeetingUpdate } from '@/lib/types/meetings';
import type { User } from '@/lib/types/users';
import { listUsers } from '@/lib/api/users';

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

    const [allUsers, setAllUsers] = useState<User[]>([]); // State to hold all users for attendee selection

    // Authentication guard
    if (!user) {
        return (
            <main className="p-6 flex items-center justify-center min-h-[500px]">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-[#444]" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">
                        Authentication Required
                    </h3>
                    <p className="text-[#aaa] mb-8 leading-relaxed">
                        Please log in to view and manage meetings.
                    </p>
                </div>
            </main>
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

    // Wrapper function to handle both create and update
    const handleSaveMeeting = async (data: MeetingCreate | MeetingUpdate, id?: number): Promise<boolean> => {
        if (id !== undefined) {
            // Update existing meeting
            return await editMeeting(id, data as MeetingUpdate);
        } else {
            // Create new meeting
            return await addMeeting(data as MeetingCreate);
        }
    };

    return (
        <main className="p-6">
            {/* Header */}
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

            {/* Attendance Overview */}
            {(user.role === 'admin' || user.role === 'core') && attendanceCounts.length > 0 && (
                <AttendanceOverview attendanceCounts={attendanceCounts} />
            )}

            {/* Meetings List or Empty State */}
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

            {/* Modals - Only rendered when needed */}
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
        </main>
    );
}

