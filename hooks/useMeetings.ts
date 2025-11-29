import { useState, useEffect } from 'react';
import { listMeetings, createMeeting, updateMeeting, deleteMeeting } from '@/lib/api/meetings';
import type { Meeting, MeetingCreate, MeetingUpdate } from '@/lib/types/meetings';

export const useMeetings = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            setLoading(true);
            const data = await listMeetings();
            setMeetings(data);
            setError(null);
        } catch (err) {
            setError('Failed to load meetings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addMeeting = async (data: MeetingCreate) => {
        try {
            await createMeeting(data);
            await loadMeetings();
            return true;
        } catch (err) {
            console.error('Failed to create meeting:', err);
            return false;
        }
    };

    const editMeeting = async (id: number, data: MeetingUpdate) => {
        try {
            await updateMeeting(id, data);
            await loadMeetings();
            return true;
        } catch (err) {
            console.error('Failed to update meeting:', err);
            return false;
        }
    };

    const removeMeeting = async (id: number) => {

        try {
            await deleteMeeting(id);
            setMeetings(meetings.filter(m => m.id !== id));
            return true;
        } catch (err) {
            console.error('Failed to delete meeting:', err);
            return false;
        }
    };

    return {
        meetings,
        loading,
        error,
        addMeeting,
        editMeeting,
        removeMeeting,
        refreshMeetings: loadMeetings,
    };
};
