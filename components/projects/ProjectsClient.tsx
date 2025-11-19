'use client';

import { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Project, ProjectFormData } from '@/lib/types/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { ProjectsEmptyState } from '@/components/projects/EmptyState';
import { toast } from 'sonner';
import { LoadingState } from '@/components/projects/LoadingState';
import { ErrorState } from '@/components/projects/ErrorState';
import { Header } from './Header';

export default function ProjectsClient() {
    const {
        projects,
        loading,
        error,
        createProject,
        updateProject,
        deleteProject,
        refetch
    } = useProjects();

    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenModal = (project?: Project) => {
        setEditingProject(project || null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProject(null);
    };

    const handleSubmit = async (formData: ProjectFormData) => {
        setIsSubmitting(true);

        try {
            if (editingProject) {
                await updateProject(editingProject.id, formData);
                toast.success('Project updated successfully');
            } else {
                await createProject(formData);
                toast.success('Project created successfully');
            }
            handleCloseModal();
            refetch();
        } catch (error) {
            toast.error(
                editingProject
                    ? 'Failed to update project'
                    : 'Failed to create project'
            );
            console.error('Project operation failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (projectId: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await deleteProject(projectId);
            toast.success('Project deleted successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to delete project');
            console.error('Failed to delete project:', error);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={refetch} />;
    }

    return (
        <main className="p-6">
            <Header onCreateNew={() => handleOpenModal()} />

            {!projects || projects.length === 0 ? (
                <ProjectsEmptyState onCreate={() => handleOpenModal()} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={handleOpenModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <ProjectModal
                isOpen={showModal}
                project={editingProject}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </main>
    );
}
