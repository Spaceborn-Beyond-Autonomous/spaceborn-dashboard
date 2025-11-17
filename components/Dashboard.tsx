"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, FolderKanban, Clock, Users, DollarSign } from "lucide-react";
import { getDashboard } from "@/lib/api/dashboard";
import { DashboardResponse, AdminDashboard, CoreDashboard, EmployeeDashboard } from "@/lib/types/dashboard";
import { User } from "@/lib/types/users";
import { getCurrentUser } from "@/lib/api/users";

export default function Dashboard() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        getDashboard().then((d) => setData(d));
        getCurrentUser().then((u) => { setUserData(u); })
    }, []);

    if (!data || !data.user) return null;
    if (!userData) return null;

    const user = {
        id: userData.id.toString(),
        username: userData.username,
        email: userData.email,
        role: userData.role,
    } as User;

    // Role-specific data extraction
    let metrics: { runningTasks: number; pendingTasks: number; completedTasks: number; runningProjects: number; totalUsers?: number; totalRevenue?: number } = {
        runningTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        runningProjects: 0,
    };

    if (user.role === "admin") {
        const dashboard = data.dashboard as AdminDashboard;
        metrics.totalUsers = dashboard.total_users;
        metrics.runningProjects = dashboard.total_projects;
        metrics.totalRevenue = dashboard.total_revenue;
        metrics.completedTasks = dashboard.tasks_by_status["done"] || 0;
        metrics.pendingTasks = dashboard.tasks_by_status["pending"] || 0;
        metrics.runningTasks = dashboard.tasks_by_status["in_progress"] || 0;
    } else if (user.role === "core") {
        const dashboard = data.dashboard as CoreDashboard;
        metrics.runningProjects = dashboard.projects.length;
        metrics.runningTasks = dashboard.open_tasks.length;
    } else if (user.role === "employee") {
        const dashboard = data.dashboard as EmployeeDashboard;
        metrics.runningTasks = dashboard.my_task_ids.length;
        metrics.runningProjects = dashboard.my_project_ids.length;
    }

    return (

        <main className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {user.role === "admin" ? (
                    <>
                        <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-[#aaa]">Total Users</span>
                                <Users className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-3xl font-semibold text-white">{metrics.totalUsers}</div>
                        </div>

                        <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-[#aaa]">Total Projects</span>
                                <FolderKanban className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-3xl font-semibold text-white">{metrics.runningProjects}</div>
                        </div>

                        <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-[#aaa]">Total Revenue</span>
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-3xl font-semibold text-white">${metrics.totalRevenue?.toFixed(2)}</div>
                        </div>

                        <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-[#aaa]">Completed Tasks</span>
                                <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-3xl font-semibold text-white">{metrics.completedTasks}</div>
                        </div>
                    </>
                ) : user.role === "core" ? (
                    <>
                        <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-[#aaa]">Projects</span>
                                <FolderKanban className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-3xl font-semibold text-white">{metrics.runningProjects}</div>
                        </div>

                        <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-[#aaa]">Open Tasks</span>
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-3xl font-semibold text-white">{metrics.runningTasks}</div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-[#aaa]">My Tasks</span>
                                <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-3xl font-semibold text-white">{metrics.runningTasks}</div>
                        </div>

                        <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-[#aaa]">My Projects</span>
                                <FolderKanban className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-3xl font-semibold text-white">{metrics.runningProjects}</div>
                        </div>
                    </>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-[#111] border border-[#222] rounded p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        {user.role === "admin" ? "Task Status Summary" : user.role === "core" ? "Open Tasks" : "My Tasks"}
                    </h3>
                    <div className="space-y-3">
                        {user.role === "admin" ? (
                            Object.entries((data.dashboard as AdminDashboard).tasks_by_status).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                                    <p className="text-sm font-medium text-white capitalize">{status.replace("_", " ")}</p>
                                    <span className="bg-[#222] px-2 py-1 rounded text-xs text-white">{count}</span>
                                </div>
                            ))
                        ) : user.role === "core" ? (
                            (data.dashboard as CoreDashboard).open_tasks.slice(0, 5).map((taskId: number) => (
                                <div key={taskId} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                                    <p className="text-sm font-medium text-white">Task {taskId}</p>
                                    <span className="bg-[#222] px-2 py-1 rounded text-xs text-white">Open</span>
                                </div>
                            ))
                        ) : (
                            (data.dashboard as EmployeeDashboard).my_task_ids.slice(0, 5).map((taskId: number) => (
                                <div key={taskId} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                                    <p className="text-sm font-medium text-white">Task {taskId}</p>
                                    <span className="bg-[#222] px-2 py-1 rounded text-xs text-white">Assigned</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-[#111] border border-[#222] rounded p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        {user.role === "admin" ? "Projects Overview" : user.role === "core" ? "Projects" : "My Projects"}
                    </h3>
                    <div className="space-y-3">
                        {user.role === "admin" ? (
                            <div className="py-2">
                                <p className="text-sm font-medium text-white">Total Projects: {(data.dashboard as AdminDashboard).total_projects}</p>
                            </div>
                        ) : user.role === "core" ? (
                            (data.dashboard as CoreDashboard).projects.slice(0, 5).map((projectId: number) => (
                                <div key={projectId} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                                    <p className="text-sm font-medium text-white">Project {projectId}</p>
                                    <span className="bg-[#222] px-2 py-1 rounded text-xs text-white">Active</span>
                                </div>
                            ))
                        ) : (
                            (data.dashboard as EmployeeDashboard).my_project_ids.slice(0, 5).map((projectId: number) => (
                                <div key={projectId} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                                    <p className="text-sm font-medium text-white">Project {projectId}</p>
                                    <span className="bg-[#222] px-2 py-1 rounded text-xs text-white">Assigned</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </main>

    );
}
