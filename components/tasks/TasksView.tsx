import 'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listTasks, updateTask, createTask, deleteTask } from '@/lib/api/tasks';
import { listUsers } from '@/lib/api/users';
import { Task, TaskStatus } from '@/lib/types/tasks';
import { User } from '@/lib/types/users';
import { Loader2, CheckCircle2, Clock, Circle, Plus, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { getProjects } from '@/lib/api/projects';
import { ProjectMin } from '@/lib/types/project_min';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// STATUS CONFIG
const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: any }> = {
    'todo': { label: 'Pending', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Circle },
    'in_progress': { label: 'In Progress', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Clock },
    'done': { label: 'Completed', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
};

// --- Task Modal ---
interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    task?: Task | null;
    users: User[];
    projects: ProjectMin[];
    isSubmitting: boolean;
}

const TaskModal = ({ isOpen, onClose, onSave, task, users, projects, isSubmitting }: TaskModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo' as TaskStatus,
        assignee_id: 'none',
        project_id: 'none',
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                assignee_id: task.assignee_id ? String(task.assignee_id) : 'none',
                project_id: task.project_id ? String(task.project_id) : 'none',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'todo',
                assignee_id: 'none',
                project_id: 'none'
            });
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            assignee_id: formData.assignee_id === 'none' ? null : Number(formData.assignee_id),
            project_id: formData.project_id === 'none' ? null : Number(formData.project_id),
        };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-lg font-semibold text-zinc-100">
                        {task ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs text-zinc-400 uppercase">Title</label>
                        <input
                            required
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400 uppercase">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 min-h-[100px]"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* STATUS */}
                        <div>
                            <label className="text-xs text-zinc-400 uppercase">Status</label>
                            <Select
                                value={formData.status}
                                onValueChange={(v) => setFormData({ ...formData, status: v as TaskStatus })}
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="todo">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="done">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* ASSIGNEE */}
                        <div>
                            <label className="text-xs text-zinc-400 uppercase">Assignee</label>
                            <Select
                                value={formData.assignee_id}
                                onValueChange={(v) => setFormData({ ...formData, assignee_id: v })}
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                    <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="none">Unassigned</SelectItem>
                                    {users.map(u => (
                                        <SelectItem key={u.id} value={String(u.id)}>{u.username}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* PROJECT */}
                        <div>
                            <label className="text-xs text-zinc-400 uppercase">Project</label>
                            <Select
                                value={formData.project_id}
                                onValueChange={(v) => setFormData({ ...formData, project_id: v })}
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="none">No Project</SelectItem>
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
                        <button type="button" onClick={onClose} className="text-zinc-400">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
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

// --- MAIN COMPONENT ---
export default function TasksView() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<ProjectMin[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const [taskData, userData, projectData] = await Promise.all([
                listTasks(),
                listUsers(),
                getProjects(),
            ]);
            setTasks(taskData);
            setUsers(userData);
            setProjects(projectData);
        } catch (err) {
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSaveTask = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingTask) await updateTask(editingTask.id, data);
            else await createTask(data);
            toast.success(editingTask ? "Task updated" : "Task created");
            await fetchData();
            setIsModalOpen(false);
        } catch {
            toast.error("Failed to save task");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (!confirm("Delete this task?")) return;
        await deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    if (!user || loading) {
        return <div className="text-zinc-500 p-6">Loading...</div>
    }

    return (
        <div className="space-y-8">
            <button
                onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
                New Task
            </button>

            {/* TASK LIST OMITTED FOR BREVITY */}

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
                users={users}
                projects={projects}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}