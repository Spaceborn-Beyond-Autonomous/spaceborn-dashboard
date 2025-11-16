export interface Meeting {
    id: number;
    title: string;
    description?: string;
    date: string;
    start_time: string;
    end_time?: string;
    location?: string;
    project_id: number;
    created_at?: string;
    updated_at?: string;
}

export interface MeetingCreate {
    title: string;
    description?: string;
    date: string;
    start_time: string;
    end_time?: string;
    location?: string;
    project_id: number;
}

export interface MeetingUpdate {
    title?: string;
    description?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    location?: string;
    project_id?: number;
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
