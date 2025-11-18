import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Project, ProjectFormData } from '@/lib/types/projects';

// Updated schema to include all statuses
const projectSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    description: z.string().min(1, 'Description is required').max(500),
    status: z.enum(['planning', 'in_progress', 'on_hold', 'completed', 'cancelled']),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    progress: z.number().min(0).max(100).optional(),
    start_date: z.string().optional(),
    due_date: z.string().optional(),
    budget: z.number().positive().optional(),
    team_id: z.number().optional(),
    tags: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
    project?: Project | null;
    onSubmit: (data: ProjectFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export function ProjectForm({ project, onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: project ? {
            name: project.name,
            description: project.description || '',
            status: project.status,
            priority: project.priority,
            progress: project.progress,
            start_date: project.start_date || '',
            due_date: project.due_date || '',
            budget: project.budget || undefined,
            team_id: project.team_id || undefined,
            tags: project.tags || [],
        } : {
            status: 'planning',
            priority: 'medium',
            progress: 0,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#aaa] mb-2">
                    Project Name *
                </label>
                <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                    disabled={isSubmitting}
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#aaa] mb-2">
                    Description *
                </label>
                <textarea
                    id="description"
                    {...register('description')}
                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white resize-none"
                    rows={3}
                    disabled={isSubmitting}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-[#aaa] mb-2">
                        Status
                    </label>
                    <select
                        id="status"
                        {...register('status')}
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                        disabled={isSubmitting}
                    >
                        <option value="planning">Planning</option>
                        <option value="in_progress">In Progress</option>
                        <option value="on_hold">On Hold</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-[#aaa] mb-2">
                        Priority
                    </label>
                    <select
                        id="priority"
                        {...register('priority')}
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                        disabled={isSubmitting}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                    {errors.priority && (
                        <p className="mt-1 text-sm text-red-400">{errors.priority.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="progress" className="block text-sm font-medium text-[#aaa] mb-2">
                    Progress (0-100%)
                </label>
                <input
                    id="progress"
                    type="number"
                    {...register('progress', { valueAsNumber: true })}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                    disabled={isSubmitting}
                />
                {errors.progress && (
                    <p className="mt-1 text-sm text-red-400">{errors.progress.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-[#aaa] mb-2">
                        Start Date
                    </label>
                    <input
                        id="start_date"
                        type="date"
                        {...register('start_date')}
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-[#aaa] mb-2">
                        Due Date
                    </label>
                    <input
                        id="due_date"
                        type="date"
                        {...register('due_date')}
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="budget" className="block text-sm font-medium text-[#aaa] mb-2">
                    Budget (Optional)
                </label>
                <input
                    id="budget"
                    type="number"
                    {...register('budget', { valueAsNumber: true })}
                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                    placeholder="10000"
                    disabled={isSubmitting}
                />
                {errors.budget && (
                    <p className="mt-1 text-sm text-red-400">{errors.budget.message}</p>
                )}
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#222] transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
