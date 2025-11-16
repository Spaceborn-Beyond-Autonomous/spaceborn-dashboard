import { api } from "../apiBase";
import type { Meeting, MeetingCreate, MeetingUpdate, MeetingAttendanceCreate, MeetingAttendanceRead, UserAttendanceCount } from "../types/meetings";

export async function listMeetings(): Promise<Meeting[]> {
    return api("meetings/");
}

export async function getMeeting(id: number): Promise<Meeting> {
    return api(`meetings/${id}/`);
}

export async function createMeeting(body: MeetingCreate): Promise<Meeting> {
    return api("meetings/", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function updateMeeting(id: number, body: MeetingUpdate): Promise<Meeting> {
    return api(`meetings/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

export async function deleteMeeting(id: number): Promise<void> {
    return api(`meetings/${id}/`, {
        method: "DELETE",
    });
}

export async function markAttendance(mid: number, body: MeetingAttendanceCreate): Promise<MeetingAttendanceRead[]> {
    return api(`meetings/${mid}/attendance`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function getMeetingAttendance(mid: number): Promise<MeetingAttendanceRead[]> {
    return api(`meetings/${mid}/attendance`);
}

export async function getUserAttendanceCounts(): Promise<UserAttendanceCount[]> {
    return api("meetings/attendance/counts");
}

export function getUpcomingMeetings() {
    return api("meetings/upcoming/");
}
