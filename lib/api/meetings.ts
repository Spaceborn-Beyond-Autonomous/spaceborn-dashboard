import { api } from "../apiBase";

export function listMeetings() {
    return api("meetings/");
}

export function getMeeting(id: number) {
    return api(`meetings/${id}/`);
}

export function createMeeting(body: any) {
    return api("meetings/", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export function updateMeeting(id: number, body: any) {
    return api(`meetings/${id}/`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export function deleteMeeting(id: number) {
    return api(`meetings/${id}/`, {
        method: "DELETE",
    });
}

export function getUpcomingMeetings() {
    return api("meetings/upcoming/");
}
