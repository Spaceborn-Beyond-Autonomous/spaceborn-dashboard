import { api } from "../apiBase";

export function listRevenue() {
    return api("revenue/");
}

export function getRevenue(id: number) {
    return api(`revenue/${id}/`);
}

export function createRevenue(body: any) {
    return api("revenue/", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export function updateRevenue(id: number, body: any) {
    return api(`revenue/${id}/`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export function deleteRevenue(id: number) {
    return api(`revenue/${id}/`, {
        method: "DELETE",
    });
}
