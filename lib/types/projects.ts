import { Meeting } from "./meetings";
import { Revenue } from "./revenue";
import { Task } from "./tasks";
import { Team } from "./teams";

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
    id: number;
    name: string;
    description?: string | null;

    // Status & Progress
    status: ProjectStatus;
    priority: ProjectPriority;
    progress: number;

    // Timeline
    start_date?: string | null;
    due_date?: string | null;
    completed_at?: string | null;

    // Financial
    budget?: number | null;
    spent: number;
    budget_remaining?: number | null;

    // Organization
    team_id?: number | null;

    // Metadata
    is_archived: boolean;
    tags?: string[];

    // Timestamps
    created_at: string;
    updated_at: string;

    // Computed
    days_until_due?: number | null;
    is_overdue: boolean;

    // Relations
    team?: Team;
    tasks?: Task[];
    revenues?: Revenue[];
    meetings?: Meeting[];
}

export interface ProjectFormData {
    name: string;
    description?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    progress?: number;
    start_date?: string;
    due_date?: string;
    budget?: number;
    team_id?: number;
    tags?: string[];
}
