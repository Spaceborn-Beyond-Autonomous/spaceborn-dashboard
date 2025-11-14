import { api } from "../apiBase";

export function listUsers() {
    return api("users/");
}

export function getUserCount() {
    return api("users/count/");
}

export function getUser(id: number) {
    return api(`users/${id}/`);
}

export function createUser(body: any) {
    return api("users/", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export function updateUser(id: number, body: any) {
    return api(`users/${id}/`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export function deleteUser(id: number) {
    return api(`users/${id}/`, {
        method: "DELETE",
    });
}

export function getCurrentUser() {
    return api("users/me/");
}

export function getUsersByRole(role: string) {
    return api(`users/by_role/?role=${role}`);
}
