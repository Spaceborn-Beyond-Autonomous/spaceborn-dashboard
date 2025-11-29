import { api } from "../apiBase";
import type { Notification } from "../types/notifications";

export async function listNotifications(): Promise<Notification[]> {
    return api("notifications/");
}

export async function markNotificationAsRead(id: number): Promise<{ message: string }> {
    return api(`notifications/${id}/read`, {
        method: "PATCH",
    });
}

export async function markAllNotificationsAsRead(): Promise<{ message: string }> {
    return api("notifications/read-all", {
        method: "PATCH",
    });
}

export async function deleteNotification(id: number): Promise<{ message: string }> {
    return api(`notifications/${id}`, {
        method: "DELETE",
    });
}