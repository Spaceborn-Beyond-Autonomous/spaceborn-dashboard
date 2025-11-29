"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, FolderKanban, Clock, Users, DollarSign, Activity, ArrowRight, LayoutDashboard } from "lucide-react";
import { getDashboard } from "@/lib/api/dashboard";
import { getCurrentUser } from "@/lib/api/users";
import { DashboardResponse, AdminDashboard, CoreDashboard, EmployeeDashboard } from "@/lib/types/dashboard";
import { User } from "@/lib/types/users";

// --- UI Sub-Components ---

// 1. Stat Card: Displays the top row metrics with icons and colors
const StatCard = ({ item }: { item: any }) => (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-zinc-900/20">
        <div className={`absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full opacity-5 blur-3xl transition-opacity group-hover:opacity-10 ${item.color}`} />

        <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {item.label}
            </span>
            <div className={`p-2 rounded-lg bg-zinc-950 border border-zinc-800 ${item.color.replace('bg-', 'text-')}`}>
                <item.icon className="h-4 w-4" />
            </div>
        </div>

        <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-zinc-100 tracking-tight">
                {item.value}
            </div>
            {/* Optional Trend Indicator */}
            {item.trend && (
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {item.trend}
                </span>
            )}
        </div>
    </div>
);

// 2. List Section: Generic list component for Tasks and Projects
const ListSection = ({ title, items, emptyText = "No data available" }: { title: string; items: any[]; emptyText?: string }) => (
    <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden h-full">
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
            </button>
        </div>
        <div className="flex-1 p-2 space-y-1 overflow-y-auto max-h-[350px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {items.length > 0 ? (
                items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full transition-colors ${item.status === 'pending' ? 'bg-amber-500' : 'bg-zinc-700 group-hover:bg-indigo-500'}`} />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">{item.label}</span>
                                <span className="text-xs text-zinc-500">{item.subLabel}</span>
                            </div>
                        </div>
                        {item.status && (
                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider 
                                ${['done', 'active', 'completed'].includes(item.status.toLowerCase()) ? 'bg-emerald-500/10 text-emerald-500' :
                                    ['pending', 'in_progress'].includes(item.status.toLowerCase()) ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-zinc-800 text-zinc-400'}`}>
                                {item.status.replace("_", " ")}
                            </span>
                        )}
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-40 text-zinc-600">
                    <LayoutDashboard className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm italic">{emptyText}</p>
                </div>
            )}
        </div>
    </div>
);

// 3. Loading Skeleton
const DashboardSkeleton = () => (
    <div className="min-h-screen bg-zinc-950 p-6 space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-zinc-900 rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-zinc-900/50 border border-zinc-800" />
            ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <div className="h-80 rounded-xl bg-zinc-900/50 border border-zinc-800" />
            <div className="h-80 rounded-xl bg-zinc-900/50 border border-zinc-800" />
        </div>
    </div>
);

// --- Main Page Component ---

export default function Dashboard() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch both concurrently for speed
                const [dashRes, userRes] = await Promise.all([
                    getDashboard(),
                    getCurrentUser()
                ]);
                setData(dashRes);
                setUserData(userRes);
            } catch (err) {
                console.error("Dashboard load failed", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <DashboardSkeleton />;
    if (!data || !userData) return null; // Consider adding an Error State component here

    // --- Data Normalization ---
    // Prepare standardized arrays based on role so the return JSX is clean

    let stats: any[] = [];
    let listOne: any[] = []; // Usually Tasks
    let listTwo: any[] = []; // Usually Projects
    let listOneTitle = "Tasks";
    let listTwoTitle = "Projects";

    if (userData.role === "admin") {
        const d = data.dashboard as AdminDashboard;

        stats = [
            { label: "Total Revenue", value: `$${d.total_revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`, icon: DollarSign, color: "bg-emerald-500" },
            { label: "Total Users", value: d.total_users, icon: Users, color: "bg-indigo-500" },
            { label: "Active Projects", value: d.total_projects, icon: FolderKanban, color: "bg-blue-500" },
            { label: "Tasks Completed", value: d.tasks_by_status["done"] || 0, icon: CheckCircle2, color: "bg-purple-500" }
        ];

        listOneTitle = "Task Status Distribution";
        listOne = Object.entries(d.tasks_by_status).map(([status, count]) => ({
            id: status,
            label: status.replace("_", " "),
            subLabel: `${count} tasks in system`,
            status: status === 'done' ? 'completed' : 'pending' // Visual mapping only
        }));

        listTwoTitle = "System Overview";
        listTwo = [
            { id: 'proj', label: 'Projects Database', subLabel: `${d.total_projects} total records`, status: 'active' },
            { id: 'users', label: 'User Database', subLabel: `${d.total_users} registered accounts`, status: 'active' },
        ];

    } else if (userData.role === "core") {
        const d = data.dashboard as CoreDashboard;

        stats = [
            { label: "Active Projects", value: d.projects.length, icon: FolderKanban, color: "bg-blue-500" },
            { label: "Open Tasks", value: d.open_tasks.length, icon: Clock, color: "bg-amber-500" },
            { label: "Team Activity", value: "High", icon: Activity, color: "bg-rose-500" },
            { label: "Pending Review", value: 3, icon: CheckCircle2, color: "bg-zinc-500" }
        ];

        listOneTitle = "Open Tasks";
        // New Backend: using t.title
        listOne = d.open_tasks.slice(0, 10).map(t => ({
            id: t.id,
            label: t.title,
            subLabel: `ID: #${t.id}`,
            status: 'pending'
        }));

        listTwoTitle = "Active Projects";
        // New Backend: using p.name
        listTwo = d.projects.slice(0, 10).map(p => ({
            id: p.id,
            label: p.name,
            subLabel: 'Ongoing',
            status: 'active'
        }));

    } else {
        // Employee
        const d = data.dashboard as EmployeeDashboard;

        stats = [
            { label: "My Tasks", value: d.my_tasks.length, icon: CheckCircle2, color: "bg-emerald-500" },
            { label: "My Projects", value: d.my_projects.length, icon: FolderKanban, color: "bg-blue-500" },
            { label: "Hours This Week", value: "32.5", icon: Clock, color: "bg-zinc-500" },
            { label: "Efficiency", value: "94%", icon: Activity, color: "bg-purple-500", trend: "+2.4%" }
        ];

        listOneTitle = "My Assigned Tasks";
        // New Backend: using t.title & t.status
        listOne = d.my_tasks.slice(0, 10).map(t => ({
            id: t.id,
            label: t.title,
            subLabel: 'Assigned to you',
            status: t.status // Use real status from backend
        }));

        listTwoTitle = "My Projects";
        // New Backend: using p.name
        listTwo = d.my_projects.slice(0, 10).map(p => ({
            id: p.id,
            label: p.name,
            subLabel: 'Team Member',
            status: 'active'
        }));
    }

    return (
        <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col gap-1">
                    <p className="text-zinc-500">Welcome back, <span className="text-zinc-300 font-medium">{userData.username}</span></p>
                </div>

                {/* KPI / Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <StatCard key={i} item={stat} />
                    ))}
                </div>

                {/* Lists Grid (Tasks & Projects) */}
                <div className="grid gap-6 md:grid-cols-2 lg:h-[450px]">
                    <ListSection title={listOneTitle} items={listOne} />
                    <ListSection title={listTwoTitle} items={listTwo} />
                </div>
            </div>
        </main>
    );
}