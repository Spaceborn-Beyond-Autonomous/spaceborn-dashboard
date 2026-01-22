'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listTasks, updateTask, createTask, deleteTask } from '@/lib/api/tasks';
import { listUsers } from '@/lib/api/users';
import { Task, TaskStatus } from '@/lib/types/tasks';
import { User } from '@/lib/types/users';
import { Loader2, CheckCircle2, Clock, Circle, Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// New Code
import { getProjects } from '@/lib/api/projects';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// --- Placeholder Types & Mock API (Needed since external files are unavailable) ---

// interface Project {
//     id: number;
//     name: string;
// }

// const mockProjects: Project[] = [
//     { id: 1, name: 'Spaceborn Core' },
//     { id: 2, name: 'UI/UX Redesign' },
//     { id: 3, name: 'Database Migration' },
//     { id: 4, name: 'Server Maintenance' },
// ];

// // Mock API call for projects (to make the component runnable)
// const listProjects = async (): Promise<Project[]> => {
//     return new Promise(resolve => {
//         setTimeout(() => resolve(mockProjects), 200);
//     });
// };

// --- Constants & Config ---
const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: any }> = {
    'todo': { label: 'Pending', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Circle },
    'in_progress': { label: 'In Progress', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Clock },
    'done': { label: 'Completed', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
};

// --- Sub-Components ---

const StatCard = ({ title, count, description }: { title: string; count: number; description: string }) => (
    <div className="flex flex-col p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300">
        <h3 className="text-sm font-medium text-zinc-400 mb-2">{title}</h3>
        <div className="text-3xl font-bold text-zinc-100 mb-1">{count}</div>
        <p className="text-xs text-zinc-500">{description}</p>
    </div>
);

const StatusBadge = ({ status, canEdit, onStatusChange }: { status: TaskStatus; canEdit: boolean; onStatusChange: (s: TaskStatus) => void }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG['todo'];
    const Icon = config.icon;

    if (!canEdit) {
        return (
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border", config.color)}>
                <Icon className="h-3 w-3" />
                {config.label}
            </span>
        );
    }

    return (
        <Select value={status} onValueChange={(val) => onStatusChange(val as TaskStatus)}>
            <SelectTrigger className={cn("w-[140px] h-8 text-xs font-medium border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 focus:ring-indigo-500/20", config.color)}>
                <div className="flex items-center gap-2">
                    <Icon className="h-3 w-3" />
                    <SelectValue />
                </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800">
                {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
                    <SelectItem key={key} value={key} className="focus:bg-zinc-900 focus:text-zinc-100">
                        <span className="flex items-center gap-2">
                            <conf.icon className={cn("h-3 w-3", conf.color.split(' ')[0])} /> {/* Extract text color */}
                            {conf.label}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

// --- Task Modal Component ---
interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    task?: Task | null;
    users: User[];
    projects: Project[]; // NEW PROP
    isSubmitting: boolean;
}

const TaskModal = ({ isOpen, onClose, onSave, task, users, projects, isSubmitting }: TaskModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo' as TaskStatus,
        assignee_id: '' as string | number,
        project_id: '' as string | number, // NEW STATE FIELD
    });

    // useEffect(() => {
    //     if (task) {
    //         setFormData({
    //             title: task.title,
    //             description: task.description || '',
    //             status: task.status,
    //             assignee_id: task.assignee_id || 'unassigned',
    //             project_id: task.project_id || 'unassigned' // Initialize project ID
    //         });
    //     } else {
    //         setFormData({
    //             title: '',
    //             description: '',
    //             status: 'todo' as TaskStatus,
    //             // assignee_id: 'unassigned',
    //             // project_id: 'unassigned' // Default unassigned
    //             assignee_id: '',
    //             project_id: ''
    //         });
    //     }
    // }, [task, isOpen]);

    useEffect(() => {
    if (task) {
        setFormData({
            title: task.title,
            description: task.description || '',
            status: task.status,
            assignee_id: task.assignee_id ? String(task.assignee_id) : '',
            project_id: task.project_id ? String(task.project_id) : '',
        });
    } else {
        setFormData({
            title: '',
            description: '',
            status: 'todo',
            assignee_id: '',
            project_id: ''
        });
    }
}, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            // assignee_id: formData.assignee_id === 'unassigned' ? null : Number(formData.assignee_id),
            assignee_id: formData.assignee_id ? Number(formData.assignee_id) : null,
            // project_id: formData.project_id === 'unassigned' ? null : Number(formData.project_id) // Handle project ID submission
            project_id: Number(formData.project_id)
        };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-lg font-semibold text-zinc-100">
                        {task ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase">Title</label>
                        <input
                            required
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Task title..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[100px]"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add details..."
                        />
                    </div>

                    {/* Updated Layout: Three columns for Status, Assignee, Project */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase">Status</label>
                            <Select
                                value={formData.status}
                                onValueChange={(v) => setFormData({ ...formData, status: v as TaskStatus })}
                            >
                                <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="todo">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="done">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase">Assignee</label>
                            <Select
                                value={String(formData.assignee_id)}
                                onValueChange={(v) => setFormData({ ...formData, assignee_id: v })}
                            >
                                <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-200">
                                    <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-48">
                                    {/* <SelectItem value="unassigned">Unassigned</SelectItem> */}
                                    <SelectItem value="">Unassigned</SelectItem>
                                    {users.map(u => (
                                        <SelectItem key={u.id} value={String(u.id)}>{u.username}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* New Project Selection Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase">Project</label>
                            <Select
                                value={String(formData.project_id)}
                                onValueChange={(v) => setFormData({ ...formData, project_id: v })}
                            >
                                <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-200">
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                {/* <SelectContent className="bg-zinc-900 border-zinc-800 max-h-48">
                                    <SelectItem value="unassigned">No Project</SelectItem>
                                    {projects.map(p => (
                                        <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent> */}
                                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-48">
                                    {projects.map(p => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Client Component ---

export default function TasksView() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]); // NEW STATE
    const [loading, setLoading] = useState(true);

    // CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const [tasksData, usersData, projectsData] = await Promise.all([ // UPDATED PROMISE.ALL
                listTasks(),
                listUsers(),
                getProjects(), // REAL API
            ]);
            setTasks(tasksData);
            setUsers(usersData);
            setProjects(projectsData); // NEW STATE SET
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getUserName = useCallback((userId: number | null | undefined) => {
        if (!userId) return 'Unassigned';
        return users.find(u => u.id === userId)?.username ?? 'Unknown User';
    }, [users]);

    // --- CRUD Handlers ---

    const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
        const originalTasks = [...tasks];
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        try {
            await updateTask(taskId, { status: newStatus });
            toast.success("Status updated");
        } catch (error) {
            setTasks(originalTasks);
            toast.error("Failed to update status");
        }
    };

    const handleSaveTask = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingTask) {
                await updateTask(editingTask.id, data);
                toast.success("Task updated");
            } else {
                await createTask(data);
                toast.success("Task created");
            }
            await fetchData();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(editingTask ? "Failed to update task" : "Failed to create task");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
            toast.success("Task deleted");
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    // --- Permissions & Filtering ---
    const canManage = ['admin', 'core'].includes(user?.role || '');

    // Employees only see their own tasks
    const displayedTasks = useMemo(() => {
        if (!user) return [];
        if (user.role === 'employee') {
            return tasks.filter(t => t.assignee_id === user.id);
        }
        return tasks;
    }, [tasks, user]);

    const stats = useMemo(() => ({
        pending: displayedTasks.filter(t => t.status === 'todo').length,
        inProgress: displayedTasks.filter(t => t.status === 'in_progress').length,
        completed: displayedTasks.filter(t => t.status === 'done').length,
    }), [displayedTasks]);

    if (!user || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-sm animate-pulse">Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header Actions (Only for Admin/Core) */}
            {canManage && (
                <div className="flex justify-end">
                    <button
                        onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="h-4 w-4" />
                        New Task
                    </button>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Pending Tasks" count={stats.pending} description="Tasks in queue" />
                <StatCard title="In Progress" count={stats.inProgress} description="Currently active" />
                <StatCard title="Completed" count={stats.completed} description="Finished this period" />
            </div>

            {/* Tasks Table */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <div className="col-span-4 pl-2">Task Details</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3">Assignee</div>
                    <div className="col-span-2 text-right pr-2">Created</div>
                    {canManage && <div className="col-span-1 text-center">Actions</div>}
                </div>

                {/* Table Body */}
                <div className="divide-y divide-zinc-800/50">
                    {displayedTasks.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">
                            <p>No tasks found.</p>
                            {user.role === 'employee' && <p className="text-xs mt-1">You have no assigned tasks.</p>}
                        </div>
                    ) : (
                        displayedTasks.map((task) => (
                            <div key={task.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-800/30 transition-colors group">

                                {/* Task Title & Desc */}
                                <div className="col-span-4 pl-2">
                                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{task.title}</p>
                                    {task.description && (
                                        <p className="text-xs text-zinc-500 truncate mt-0.5 max-w-[90%]">{task.description}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <StatusBadge
                                        status={task.status}
                                        canEdit={canManage || task.assignee_id === user.id}
                                        onStatusChange={(s) => handleStatusChange(task.id, s)}
                                    />
                                </div>

                                {/* Assignee */}
                                <div className="col-span-3 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold border border-zinc-700 shrink-0">
                                        {getUserName(task.assignee_id).substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-zinc-400 truncate">{getUserName(task.assignee_id)}</span>
                                </div>

                                {/* Date */}
                                <div className="col-span-2 text-right pr-2 text-xs text-zinc-500 font-mono">
                                    {new Date(task.created_at).toLocaleDateString()}
                                </div>

                                {/* Actions (Admin/Core Only) */}
                                {canManage && (
                                    <div className="col-span-1 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
                users={users}
                projects={projects} // NEW PROP PASS
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
