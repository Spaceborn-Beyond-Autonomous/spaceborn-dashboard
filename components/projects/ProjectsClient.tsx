'use client';

import { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Project, ProjectFormData, Topic } from '@/lib/types/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { ProjectsEmptyState } from '@/components/projects/EmptyState';
import { TopicModal } from '@/components/projects/TopicModal';
import { TopicSection } from '@/components/projects/TopicSection';
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

    const [showTopicModal, setShowTopicModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [topics, setTopics] = useState<Topic[]>([]);

    // Organize projects into topics on data load
    useEffect(() => {
        if (projects && projects.length > 0) {
            const defaultTopic: Topic = {
                id: 'default',
                name: 'Drones',
                open: true,
                projects: projects.filter(p => !p.tags?.includes('topic:'))
            };

            const topicProjects: Topic[] = projects
                .filter(p => p.tags && p.tags.some(t => t.startsWith('topic:')))
                .reduce((acc: Topic[], project: Project) => {
                    const topicTag = project.tags?.find(t => t.startsWith('topic:'));
                    if (topicTag) {
                        const topicName = topicTag.replace('topic:', '');
                        let topic = acc.find(t => t.name === topicName);
                        
                        if (!topic) {
                            topic = {
                                id: `topic-${topicName.toLowerCase().replace(/\s+/g, '-')}`,
                                name: topicName,
                                open: false,
                                projects: []
                            };
                            acc.push(topic);
                        }
                        topic.projects.push(project);
                    }
                    return acc;
                }, []);

            setTopics([defaultTopic, ...topicProjects]);
        } else {
            setTopics([]);
        }
    }, [projects]);

    const handleOpenTopicModal = () => {
        setSelectedTopic(null);
        setShowTopicModal(true);
    };

    const handleOpenProjectModal = (topic?: Topic, project?: Project) => {
        setSelectedTopic(topic || null);
        setEditingProject(project || null);
        setShowProjectModal(true);
    };

    const handleCloseModals = () => {
        setShowTopicModal(false);
        setShowProjectModal(false);
        setEditingProject(null);
        setSelectedTopic(null);
    };

    const handleTopicSubmit = (topicName: string) => {
        if (topicName.trim()) {
            const newTopic: Topic = {
                id: `topic-${topicName.toLowerCase().replace(/\s+/g, '-')}`,
                name: topicName,
                open: true,
                projects: []
            };
            setTopics(prev => [newTopic, ...prev.filter(t => t.id !== 'default' || t !== newTopic)]);
            setSelectedTopic(newTopic);
            setShowTopicModal(false);
            setShowProjectModal(true);
        }
    };

    const handleSubmitProject = async (formData: ProjectFormData) => {
        setIsSubmitting(true);

        try {
            // Add topic tag if project is in a topic
            const dataWithTopic = selectedTopic && selectedTopic.id !== 'default'
                ? {
                    ...formData,
                    tags: formData.tags ? [...formData.tags, `topic:${selectedTopic.name}`] : [`topic:${selectedTopic.name}`]
                }
                : formData;

            if (editingProject) {
                await updateProject(editingProject.id, dataWithTopic);
                toast.success('Project updated successfully');
            } else {
                await createProject(dataWithTopic);
                toast.success('Project created successfully');
            }
            handleCloseModals();
            refetch();
        } catch (error) {
            toast.error(editingProject ? 'Failed to update project' : 'Failed to create project');
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
        <main className="p-6 max-w-7xl mx-auto">
            <Header onCreateNew={handleOpenTopicModal} />
            
            {topics.length === 0 ? (
                <ProjectsEmptyState onCreate={handleOpenTopicModal} />
            ) : (
                <div className="space-y-6">
                    {topics.map((topic) => (
                        <TopicSection
                            key={topic.id}
                            topic={topic}
                            onToggle={() => {
                                setTopics(prev => 
                                    prev.map(t => 
                                        t.id === topic.id 
                                            ? { ...t, open: !t.open }
                                            : t
                                    )
                                );
                            }}
                            onAddProject={() => handleOpenProjectModal(topic)}
                            onEditProject={(project) => handleOpenProjectModal(topic, project)} 
                            onDeleteProject={handleDelete}
                        />
                    ))}
                </div>
            )}

            <TopicModal
                isOpen={showTopicModal}
                onClose={() => setShowTopicModal(false)}
                onSubmit={handleTopicSubmit}
            />
            
            <ProjectModal
                isOpen={showProjectModal}
                project={editingProject}
                onClose={handleCloseModals}
                onSubmit={handleSubmitProject}
                isSubmitting={isSubmitting}
            />
        </main>
    );
}
