"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { tasks, projects, teams, revenue, users } from "@/mock/mockData";

type Task = {
    id: number;
    title: string;
    status: "In Progress" | "Completed" | "Pending";
    assignedTo: number;
    deadline: string;
};

type Project = {
    id: number;
    name: string;
    status: "Running" | "Planning" | "Completed";
    assignedTo: number[];
};

type Team = {
    id: number;
    name: string;
    members: number[];
};

type Revenue = {
    total: number;
    pending: number;
    completed: number;
};

import type { Meeting } from "@/lib/types/meetings";

type User = { id: number; name: string; email: string; role: string };

export const DataContext = createContext({
    tasks: [] as Task[],
    projects: [] as Project[],
    teams: [] as Team[],
    revenue: {} as Revenue,
    meetings: [] as Meeting[],
    users: [] as User[],
    updateTaskStatus: (taskId: number, newStatus: string) => { },
});

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export function DataProvider({ children }: any) {
    const [taskList, setTaskList] = useState<Task[]>(tasks);
    const [projectList, setProjectList] = useState<Project[]>(projects);
    const [teamList, setTeamList] = useState<Team[]>(teams);
    const [revenueData, setRevenueData] = useState<Revenue>(revenue);
    const [meetingsList, setMeetingsList] = useState<Meeting[]>([]);
    const [usersList, setUsersList] = useState<User[]>(users);

    useEffect(() => {
        // Initialize data from mock
        setTaskList(tasks);
        setProjectList(projects);
        setTeamList(teams);
        setRevenueData(revenue);
        setUsersList(users);
    }, []);

    function updateTaskStatus(taskId: number, newStatus: string) {
        setTaskList(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus as Task['status'] } : task
            )
        );
    }

    return (
        <DataContext.Provider value={{
            tasks: taskList,
            projects: projectList,
            teams: teamList,
            revenue: revenueData,
            meetings: meetingsList,
            users: usersList,
            updateTaskStatus,
        }}>
            {children}
        </DataContext.Provider>
    );
}
