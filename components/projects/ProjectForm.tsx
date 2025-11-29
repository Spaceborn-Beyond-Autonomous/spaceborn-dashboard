import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Project, ProjectFormData } from '@/lib/types/projects';
import { Calendar, DollarSign, Loader2, Tag, Percent, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Schema (Unchanged) ---
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

// --- Shared Styles ---
const labelStyles = "block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider";
const inputStyles = "w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

export function ProjectForm({ project, onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: project ? {
            name: project.name,
            description: project.description || '',
            status: project.status,
            priority: project.priority,
            progress: project.progress,
            start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '', // Format for date input
            due_date: project.due_date ? new Date(project.due_date).toISOString().split('T')[0] : '',
            budget: project.budget || undefined,
            team_id: project.team_id || undefined,
            tags: project.tags || [],
        } : {
            status: 'planning',
            priority: 'medium',
            progress: 0,
        },
    });

    const currentProgress = watch('progress') || 0;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Name Section */}
            <div className="space-y-1">
                <label htmlFor="name" className={labelStyles}>Project Name <span className="text-red-400">*</span></label>
                <input
                    id="name"
                    type="text"
                    {...register('name')}
                    placeholder="e.g. Website Redesign"
                    className={inputStyles}
                    disabled={isSubmitting}
                />
                {errors.name && (
                    <p className="flex items-center gap-1 text-xs text-red-400 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.name.message}
                    </p>
                )}
            </div>

            {/* Description Section */}
            <div className="space-y-1">
                <label htmlFor="description" className={labelStyles}>Description <span className="text-red-400">*</span></label>
                <textarea
                    id="description"
                    {...register('description')}
                    placeholder="Briefly describe the project goals..."
                    className={cn(inputStyles, "resize-none min-h-[100px]")}
                    disabled={isSubmitting}
                />
                {errors.description && (
                    <p className="flex items-center gap-1 text-xs text-red-400 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.description.message}
                    </p>
                )}
            </div>

            {/* Grid: Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="status" className={labelStyles}>Status</label>
                    <div className="relative">
                        <select id="status" {...register('status')} className={cn(inputStyles, "appearance-none")} disabled={isSubmitting}>
                            <option value="planning">Planning</option>
                            <option value="in_progress">In Progress</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none">
                            <div className="h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-500" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="priority" className={labelStyles}>Priority</label>
                    <div className="relative">
                        <select id="priority" {...register('priority')} className={cn(inputStyles, "appearance-none")} disabled={isSubmitting}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none">
                            <div className="h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Slider */}
            <div className="space-y-2 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                <div className="flex justify-between items-center">
                    <label htmlFor="progress" className={cn(labelStyles, "mb-0")}>Progress Completion</label>
                    <span className="text-sm font-mono text-indigo-400">{currentProgress}%</span>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentProgress}
                        onChange={(e) => setValue('progress', parseInt(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        disabled={isSubmitting}
                    />

                    {/* FIXED SECTION BELOW */}
                    <div className="relative w-24"> {/* Changed from w-20 to w-24 */}
                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                        <input
                            type="number"
                            {...register('progress', { valueAsNumber: true })}
                            className={cn(
                                inputStyles,
                                "py-1.5 px-3 text-right pr-8 h-9 text-sm",
                                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            )}
                            min="0"
                            max="100"
                        />
                    </div>
                </div>
            </div>

            {/* Grid: Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="start_date" className={labelStyles}>Start Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <input
                            id="start_date"
                            type="date"
                            {...register('start_date')}
                            className={cn(inputStyles, "pl-10")} // padding-left for icon
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="due_date" className={labelStyles}>Due Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <input
                            id="due_date"
                            type="date"
                            {...register('due_date')}
                            className={cn(inputStyles, "pl-10")}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </div>

            {/* Budget */}
            <div className="space-y-1">
                <label htmlFor="budget" className={labelStyles}>Budget Allocation</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                        id="budget"
                        type="number"
                        {...register('budget', { valueAsNumber: true })}
                        className={cn(inputStyles, "pl-10")}
                        placeholder="0.00"
                        step="0.01"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-zinc-800">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{project ? 'Update Project' : 'Create Project'}</span>
                    )}
                </button>
            </div>
        </form>
    );
}