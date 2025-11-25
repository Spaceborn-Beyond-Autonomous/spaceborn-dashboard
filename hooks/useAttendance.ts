import { useState, useEffect } from 'react';
import { getMeetingAttendance, markAttendance, getUserAttendanceCounts } from '@/lib/api/meetings';
import type { MeetingAttendanceRead, MeetingAttendanceCreate, UserAttendanceCount } from '@/lib/types/meetings';

export const useAttendance = (userRole: string) => {
    const [attendanceCounts, setAttendanceCounts] = useState<UserAttendanceCount[]>([]);

    useEffect(() => {
        if (userRole === 'admin' || userRole === 'core') {
            loadAttendanceCounts();
        }
    }, [userRole]);

    const loadAttendanceCounts = async () => {
        try {
            const data = await getUserAttendanceCounts();
            setAttendanceCounts(data);
        } catch (err) {
            console.error('Failed to load attendance counts:', err);
        }
    };

    return {
        attendanceCounts,
        refreshAttendanceCounts: loadAttendanceCounts,
    };
};

export const useMeetingAttendance = (meetingId: number | null) => {
    const [attendance, setAttendance] = useState<MeetingAttendanceRead[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (meetingId) {
            loadAttendance();
        }
    }, [meetingId]);

    const loadAttendance = async () => {
        if (!meetingId) return;

        try {
            setLoading(true);
            const data = await getMeetingAttendance(meetingId);
            setAttendance(data);
        } catch (err) {
            console.error('Failed to load attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const addAttendance = async (data: MeetingAttendanceCreate) => {
        if (!meetingId) return false;

        try {
            await markAttendance(meetingId, data);
            await loadAttendance();
            return true;
        } catch (err) {
            console.error('Failed to mark attendance:', err);
            return false;
        }
    };

    return {
        attendance,
        loading,
        addAttendance,
        refreshAttendance: loadAttendance,
    };
};
