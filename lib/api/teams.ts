import { api } from "../apiBase";

export function listTeams() {
    return api("teams/");
}

export function getTeam(id: number) {
    return api(`teams/${id}/`);
}

export function createTeam(body: any) {
    return api("teams/", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export function updateTeam(id: number, body: any) {
    return api(`teams/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

export function deleteTeam(id: number) {
    return api(`teams/${id}/`, {
        method: "DELETE",
    });
}
