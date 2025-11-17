import { Project } from "./projects";
import { User } from "./users";

// Task status enum matching your Python enum
export enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DONE = "done",
}

export interface Task {
    id: number;
    title: string;
    description?: string | null;
    status: TaskStatus;
    project_id: number;
    assignee_id?: number | null;
    created_at: string;  // ISO date string
    updated_at: string;  // ISO date string

    project?: Project;   // populated if included in backend response
    assignee?: User;     // populated if included
}