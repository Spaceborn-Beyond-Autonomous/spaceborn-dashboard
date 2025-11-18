// hooks/useProjects.ts
import { useState, useEffect, useCallback } from 'react';
import { getProjects, createProject as apiCreateProject, updateProject as apiUpdateProject, deleteProject as apiDeleteProject } from '@/lib/api/projects';
import { Project, ProjectFormData } from '@/lib/types/projects';

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const createProject = async (data: ProjectFormData) => {
        const newProject = await apiCreateProject(data);
        setProjects(prev => [...prev, newProject]);
        return newProject;
    };

    const updateProject = async (id: number, data: Partial<ProjectFormData>) => {
        const updated = await apiUpdateProject(id, data);
        setProjects(prev => prev.map(p => p.id === id ? updated : p));
        return updated;
    };

    const deleteProject = async (id: number) => {
        await apiDeleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    return {
        projects,
        loading,
        error,
        createProject,
        updateProject,
        deleteProject,
        refetch: fetchProjects
    };
}
