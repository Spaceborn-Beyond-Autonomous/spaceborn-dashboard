import { User } from "./users";

export interface Attendances {
    id: number;
    attended: boolean;
    joined_at?: string;
    user: User;  // Nested user object
}


export interface Meeting {
    id: number;
    title: string;
    agenda?: string;
    scheduled_at: string;
    attendances: Attendances[];
    meeting_link?: string;
    organizer?: string;
    reminder_interval: number;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface MeetingCreate {
    title: string;
    agenda?: string;
    scheduled_at: string;
    attendees: number[];
    meeting_link?: string;
    organizer?: string;
    reminder_interval: number;
    notes?: string;
}

export interface MeetingUpdate {
    title?: string;
    agenda?: string;
    scheduled_at?: string;
    attendees?: number[];
    meeting_link?: string;
    organizer?: string;
    reminder_interval?: number;
    notes?: string;
}

export interface MeetingAttendanceCreate {
    user_ids: number[];
}

export interface MeetingAttendanceRead {
    id: number;
    meeting_id: number;
    user_id: number;
    attended: boolean;
    created_at?: string;
}

export interface UserAttendanceCount {
    user_id: number;
    username: string;
    email: string;
    meetings_joined: number;
}
