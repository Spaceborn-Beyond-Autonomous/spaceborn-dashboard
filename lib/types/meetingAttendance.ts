import { Meeting } from "./meetings";
import { User } from "./users";

export interface MeetingAttendance {
    id: number;
    meeting_id: number;
    user_id: number;
    attended: boolean;
    joined_at?: string | null;  // ISO date string, optional and nullable
    created_at: string;          // ISO date string

    meeting?: Meeting;           // populated if included in backend response
    user?: User;                 // populated if included
}