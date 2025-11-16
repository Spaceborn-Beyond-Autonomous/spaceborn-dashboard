'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Sidebar from './Sidebar';
import Header from './Header';
import { FolderKanban, Plus, Edit, Trash2, X } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const BACKEND_URL = process.env.BACKEND_URL;

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'core' | 'employee';
}

interface Project {
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

interface ProjectsClientProps {
    user: User;
    projects: Project[];
}

export default function ProjectsClient({ user, projects }: ProjectsClientProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'planning' as Project['status'],
        startDate: '',
        endDate: '',
        budget: '',
    });

    const handleOpenModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                name: project.name,
                description: project.description,
                status: project.status,
                startDate: project.startDate,
                endDate: project.endDate || '',
                budget: project.budget?.toString() || '',
            });
        } else {
            setEditingProject(null);
            setFormData({
                name: '',
                description: '',
                status: 'planning',
                startDate: '',
                endDate: '',
                budget: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProject(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const endpoint = editingProject
                ? `/api/projects/${editingProject.id}`
                : '/api/projects';

            const method = editingProject ? 'PUT' : 'POST';

            await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    budget: formData.budget ? parseFloat(formData.budget) : undefined,
                }),
            });

            handleCloseModal();
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    };

    const handleDelete = async (projectId: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-400';
            case 'in_progress':
                return 'bg-blue-500/20 text-blue-400';
            case 'planning':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'on_hold':
                return 'bg-red-500/20 text-red-400';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar user={user} />
            <div className="flex-1 md:ml-64">
                <Header title="Projects" user={user} />
                <main className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-white">All Projects</h2>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            New Project
                        </button>
                    </div>

                    {/* Empty State Check */}
                    {!projects || projects.length === 0 ? (
                        <div className="flex items-center justify-center min-h-[500px]">
                            <div className="text-center max-w-md">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                    <FolderKanban className="h-12 w-12 text-[#444]" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-3">
                                    No Projects Yet
                                </h3>
                                <p className="text-[#aaa] mb-8 leading-relaxed">
                                    Get started by creating your first project. Track progress, manage
                                    budgets, and collaborate with your team.
                                </p>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition-all font-medium"
                                >
                                    <Plus className="h-5 w-5" />
                                    Create Your First Project
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Projects Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                                <FolderKanban className="h-5 w-5 text-black" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {project.name}
                                                </h3>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded uppercase tracking-wide ${getStatusColor(
                                                        project.status
                                                    )}`}
                                                >
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-[#aaa] mb-4 line-clamp-2">
                                        {project.description}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-[#aaa] mb-1">
                                            <span>Progress</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white transition-all duration-300"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs text-[#aaa] mb-4">
                                        <div className="flex justify-between">
                                            <span>Start Date:</span>
                                            <span>
                                                {new Date(project.startDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {project.endDate && (
                                            <div className="flex justify-between">
                                                <span>End Date:</span>
                                                <span>
                                                    {new Date(project.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                        {project.budget && (
                                            <div className="flex justify-between">
                                                <span>Budget:</span>
                                                <span>${project.budget.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-[#222]">
                                        <button
                                            onClick={() => handleOpenModal(project)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] rounded transition-all text-white text-sm"
                                        >
                                            <Edit className="h-3 w-3" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-red-500/20 rounded transition-all text-white text-sm"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                            <div className="bg-[#111] border border-[#222] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-white">
                                        {editingProject ? 'Edit Project' : 'New Project'}
                                    </h3>
                                    <button onClick={handleCloseModal}>
                                        <X className="h-5 w-5 text-[#aaa] hover:text-white" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#aaa] mb-2">
                                            Project Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#aaa] mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white resize-none"
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#aaa] mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    status: e.target.value as Project['status'],
                                                })
                                            }
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                        >
                                            <option value="planning">Planning</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="on_hold">On Hold</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#aaa] mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, startDate: e.target.value })
                                            }
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#aaa] mb-2">
                                            End Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, endDate: e.target.value })
                                            }
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#aaa] mb-2">
                                            Budget (Optional)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.budget}
                                            onChange={(e) =>
                                                setFormData({ ...formData, budget: e.target.value })
                                            }
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                            placeholder="10000"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-all"
                                        >
                                            {editingProject ? 'Update' : 'Create'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 px-4 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#222] transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
