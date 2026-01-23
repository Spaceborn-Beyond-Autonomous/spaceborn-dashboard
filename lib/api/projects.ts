import { api } from '../apiBase';
import { Project } from '../types/projects';

export async function getProjects(): Promise<Project[]> {
    return api('projects/');
}

export async function getProject(id: number | string): Promise<Project> {
    return api(`projects/${id}/`);
}

export async function createProject(data: Partial<Project>): Promise<Project> {
    return api('projects/', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
    return api(`projects/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteProject(id: number): Promise<void> {
    return api(`projects/${id}/`, {
        method: 'DELETE',
    });
}