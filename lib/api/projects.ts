import { api } from '../apiBase';

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
    startDate: string;
    endDate?: string;
    teamId: string;
    budget?: number;
    progress: number;
}

export async function getProjects(): Promise<Project[]> {
    return api('projects/');
}

export async function getProject(id: string): Promise<Project> {
    return api(`projects/${id}/`);
}

export async function createProject(data: Partial<Project>): Promise<Project> {
    return api('projects/', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return api(`projects/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteProject(id: string): Promise<void> {
    return api(`projects/${id}/`, {
        method: 'DELETE',
    });
}
