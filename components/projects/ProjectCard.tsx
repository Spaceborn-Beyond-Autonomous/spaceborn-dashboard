import { Edit, Trash2, FolderKanban, Users, Calendar, TrendingUp, AlertCircle, CheckCircle2, Clock, XCircle, PlayCircle } from 'lucide-react';
import { Project } from '@/lib/types/projects';
import { cn } from '@/lib/utils';

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

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'completed':
                return { color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle2 };
            case 'in_progress':
                return { color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: PlayCircle };
            case 'planning':
                return { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Clock };
            case 'on_hold':
                return { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: AlertCircle };
            case 'cancelled':
                return { color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', icon: XCircle };
            default:
                return { color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', icon: FolderKanban };
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
            case 'high':
                return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'medium':
                return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'low':
                return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            default:
                return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
        }
    };

    const statusConfig = getStatusConfig(project.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="group relative flex flex-col justify-between p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/20">

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
                        <FolderKanban className="h-6 w-6 text-zinc-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-100 leading-tight group-hover:text-white transition-colors">{project.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider border", statusConfig.color)}>
                                <StatusIcon className="h-3 w-3" />
                                {project.status.replace('_', ' ')}
                            </span>
                            <span className={cn("px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider border", getPriorityColor(project.priority))}>
                                {project.priority}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-400 mb-5 line-clamp-2 min-h-10 leading-relaxed">
                {project.description || 'No description provided for this project.'}
            </p>

            {/* Progress Bar */}
            <div className="mb-5 space-y-2">
                <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Completion
                    </span>
                    <span className={cn(
                        project.progress === 100 ? "text-emerald-400" : "text-zinc-200"
                    )}>{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-500 ease-out rounded-full",
                            project.progress === 100 ? "bg-emerald-500" : "bg-indigo-500"
                        )}
                        style={{ width: `${project.progress}%` }}
                    />
                </div>
            </div>

            {/* Team Info */}
            {project.team && (
                <div className="mb-5 p-2.5 bg-zinc-900/50 rounded-lg border border-zinc-800/50 flex items-center gap-2.5">
                    <div className="p-1.5 bg-zinc-800 rounded-md">
                        <Users className="h-3.5 w-3.5 text-zinc-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold">Assigned Team</span>
                        <span className="text-xs text-zinc-200 font-medium">{project.team.name}</span>
                    </div>
                </div>
            )}

            {/* Footer / Dates */}
            <div className="flex-1 border-t border-zinc-800/50 pt-4 mb-4 grid grid-cols-2 gap-4">
                {project.start_date && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Start
                        </span>
                        <span className="text-xs text-zinc-300 font-medium pl-4">{formatDate(project.start_date)}</span>
                    </div>
                )}
                {project.due_date && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Due
                        </span>
                        <span className={cn(
                            "text-xs font-medium pl-4",
                            project.is_overdue ? "text-rose-400" : "text-zinc-300"
                        )}>
                            {formatDate(project.due_date)}
                            {project.is_overdue && ' (!)'}
                        </span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
                <button
                    onClick={() => onEdit(project)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 rounded-lg transition-all text-zinc-300 hover:text-white text-xs font-medium group/edit"
                >
                    <Edit className="h-3.5 w-3.5 transition-transform group-hover/edit:scale-110" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 rounded-lg transition-all text-rose-400 hover:text-rose-300 text-xs font-medium group/delete"
                >
                    <Trash2 className="h-3.5 w-3.5 transition-transform group-hover/delete:scale-110" />
                    Delete
                </button>
            </div>
        </div>
    );
}