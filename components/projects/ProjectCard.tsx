// components/projects/ProjectCard.tsx
import { Edit, Trash2, FolderKanban, Users, Calendar, TrendingUp } from 'lucide-react';
import { Project } from '@/lib/types/projects';

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (id: number) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                return 'bg-orange-500/20 text-orange-400';
            case 'cancelled':
                return 'bg-red-500/20 text-red-400';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'text-red-400';
            case 'high':
                return 'text-orange-400';
            case 'medium':
                return 'text-yellow-400';
            case 'low':
                return 'text-green-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <FolderKanban className="h-5 w-5 text-black" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded uppercase tracking-wide ${getStatusColor(project.status)}`}>
                                {project.status.replace('_', ' ')}
                            </span>
                            <span className={`text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#aaa] mb-4 line-clamp-2 min-h-10">
                {project.description || 'No description provided'}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-[#aaa] mb-1">
                    <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Progress
                    </span>
                    <span>{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                    ></div>
                </div>
            </div>

            {project.team && (
                <div className="mb-4 p-2 bg-[#0a0a0a] rounded border border-[#222] space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3 text-[#aaa]" />
                        <span className="text-[#aaa]">Team:</span>
                        <span className="text-white">{project.team.name}</span>
                    </div>
                </div>
            )}

            {/* Dates */}
            <div className="space-y-2 text-xs text-[#aaa] mb-4 pb-4 border-b border-[#222]">
                {project.start_date && (
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Start
                        </span>
                        <span className="text-white">{formatDate(project.start_date)}</span>
                    </div>
                )}
                {project.due_date && (
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due
                        </span>
                        <span className={`${project.is_overdue ? 'text-red-400' : 'text-white'}`}>
                            {formatDate(project.due_date)}
                            {project.is_overdue && ' (Overdue)'}
                        </span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(project)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] rounded transition-all text-white text-sm"
                >
                    <Edit className="h-3 w-3" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-red-500/20 rounded transition-all text-white text-sm"
                >
                    <Trash2 className="h-3 w-3" />
                    Delete
                </button>
            </div>
        </div>
    );
}
