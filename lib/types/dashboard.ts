export type AdminDashboard = {
    role: "admin";
    user: { id: number; name: string; email: string };
    statistics: {
        total_users: number;
        total_projects: number;
        completed_tasks: number;
    };
    recent_projects: any[];
    overdue_tasks: any[];
    revenue: any;
};

export type CoreDashboard = {
    role: "core";
    user: { id: number; name: string; email: string };

    teams: any[];
    statistics: any;
    team_projects: any[];
    overdue_tasks: any[];
    upcoming_meetings: any[];
};

export type EmployeeDashboard = {
    role: "employee";
    user: { id: number; name: string; email: string };
    statistics: any;
    my_tasks: any[];
    overdue_tasks: any[];
    upcoming_meetings: any[];
};

export type DashboardResponse =
    | AdminDashboard
    | CoreDashboard
    | EmployeeDashboard;
