import { useState, useEffect, useCallback } from 'react';
import { getProjects, createProject as apiCreate, updateProject as apiUpdate, deleteProject as apiDelete } from '@/lib/api/projects';
import { Project, ProjectFormData } from '@/lib/types/projects';

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
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
        const created = await apiCreate(data);
        setProjects(prev => [...prev, created]);
        return created;
    };

    const updateProject = async (id: number, data: Partial<ProjectFormData>) => {
        const updated = await apiUpdate(id, data);
        setProjects(prev => prev.map(p => p.id === id ? updated : p));
        return updated;
    };

    const deleteProject = async (id: number) => {
        await apiDelete(id);
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    return { projects, loading, error, createProject, updateProject, deleteProject, refetch: fetchProjects };
}