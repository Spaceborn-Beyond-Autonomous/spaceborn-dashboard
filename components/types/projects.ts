// lib/types/projects.ts
export interface Project {
    id: number;
    name: string;
    description: string;
    status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'critical';
    progress: number;
    start_date?: string;
    due_date?: string;
    budget?: number;
    team_id?: number;
    team?: {
        name: string;
    };
    tags?: string[];
    is_overdue?: boolean;
}

export interface Topic {
    id: string; // client-side generated
    name: string;
    open: boolean;
    projects: Project[];
}

export interface ProjectFormData {
    name: string;
    description: string;
    status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'critical';
    progress?: number;
    start_date?: string;
    due_date?: string;
    budget?: number;
    team_id?: number;
    tags?: string[];
}
