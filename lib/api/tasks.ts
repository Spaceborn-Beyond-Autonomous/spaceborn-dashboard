import { api } from "../apiBase";

export function listTasks() {
    return api("tasks/");
}

export function getTaskCount() {
    return api("tasks/count/");
}

export function getTask(id: number) {
    return api(`tasks/${id}/`);
}

export function createTask(body: any) {
    return api("tasks/", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export function updateTask(id: number, body: any) {
    return api(`tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

export function deleteTask(id: number) {
    return api(`tasks/${id}`, {
        method: "DELETE",
    });
}

export function getMyTasks() {
    return api("tasks/my_tasks/");
}

export function getOverdueTasks() {
    return api("tasks/overdue/");
}

export function assignTaskToUser(taskId: number, userId: number) {
    return api(`tasks/${taskId}/assign/`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
    });
}