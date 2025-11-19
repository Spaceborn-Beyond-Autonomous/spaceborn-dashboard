import { useState } from 'react';
import type { Meeting } from '@/lib/types/meetings';

export const useMeetingForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        agenda: '',
        date: '',
        scheduled_at: '',
        attendees: [] as number[],
        meeting_link: '',
        organizer: '',
        reminder_interval: '15',
        notes: ''
    });

    const resetForm = () => {
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
    };

    const loadMeeting = (meeting: Meeting) => {
        setFormData({
            title: meeting.title,
            agenda: meeting.agenda || '',
            date: meeting.date,
            scheduled_at: meeting.scheduled_at,
            attendees: meeting.attendees || [],
            meeting_link: meeting.meeting_link || '',
            organizer: meeting.organizer || '',
            reminder_interval: meeting.reminder_interval.toString(),
            notes: meeting.notes || ''
        });
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const getFormattedData = () => {
        return {
            ...formData,
            reminder_interval: parseInt(formData.reminder_interval, 10)
        };
    };

    return {
        formData,
        resetForm,
        loadMeeting,
        updateField,
        getFormattedData,
    };
};
