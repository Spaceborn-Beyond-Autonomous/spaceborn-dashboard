import { Project } from "./projects";
import { User } from "./users";


export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
    id: number;
    title: string;
    description?: string | null;
    status: TaskStatus;
    assignee_id?: number | null;
    project_id: number;
    created_at: string;
    updated_at: string;
}


// Task status enum matching your Python enum
// export enum TaskStatus {
//     TODO = "todo",
//     IN_PROGRESS = "in_progress",
//     DONE = "done",
// }

// export interface Task {
//     id: number;
//     title: string;
//     description?: string | null;
//     status: TaskStatus;
//     project_id: number;
//     assignee_id?: number | null;
//     created_at: string;  // ISO date string
//     updated_at: string;  // ISO date string

//     project?: Project;   // populated if included in backend response
//     assignee?: User;     // populated if included
// }