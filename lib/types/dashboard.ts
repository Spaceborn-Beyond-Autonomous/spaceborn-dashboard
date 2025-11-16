export type User = {
    id: number;
    name: string;
    email: string;
    role: "admin" | "core" | "employee";
};

export type AdminDashboard = {
    total_users: number;
    total_projects: number;
    total_revenue: number;
    tasks_by_status: Record<string, number>;
};

export type CoreDashboard = {
    projects: number[];
    open_tasks: number[];
};

export type EmployeeDashboard = {
    my_task_ids: number[];
    my_project_ids: number[];
};

export type DashboardResponse = {
    user: User;
    dashboard: AdminDashboard | CoreDashboard | EmployeeDashboard;
};
