import { api } from "../apiBase";
import { DashboardResponse } from "../types/dashboard";

export async function getDashboard(): Promise<DashboardResponse> {
    return api("dashboard/");
}
