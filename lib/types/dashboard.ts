import { User } from "./users";

// Helper types for the lists
export interface TaskItem {
    id: number;
    title: string;
    status?: string; // Optional: Employee view includes status, Core view might not
}

export interface ProjectItem {
    id: number;
    name: string;
}

// 1. Admin Dashboard Data Structure
export interface AdminDashboard {
    total_users: number;
    total_projects: number;
    total_revenue: number;
    tasks_by_status: Record<string, number>; // e.g., { "pending": 5, "done": 12 }
}

// 2. Core Dashboard Data Structure
export interface CoreDashboard {
    projects: ProjectItem[];   // Array of { id, name }
    open_tasks: TaskItem[];    // Array of { id, title }
}

// 3. Employee Dashboard Data Structure
export interface EmployeeDashboard {
    my_tasks: TaskItem[];      // Array of { id, title, status }
    my_projects: ProjectItem[]; // Array of { id, name }
}

// Main Response Wrapper
export interface DashboardResponse {
    user: User;
    dashboard: AdminDashboard | CoreDashboard | EmployeeDashboard;
}