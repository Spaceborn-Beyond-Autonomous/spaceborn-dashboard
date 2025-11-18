import { X } from 'lucide-react';
import { Project, ProjectFormData } from '@/lib/types/projects';
import { ProjectForm } from './ProjectForm';

interface ProjectModalProps {
    isOpen: boolean;
    project: Project | null;
    onClose: () => void;
    onSubmit: (data: ProjectFormData) => Promise<void>;
    isSubmitting?: boolean;  // Add this
}

export function ProjectModal({ isOpen, project, onClose, onSubmit, isSubmitting }: ProjectModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-[#222] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">
                        {project ? 'Edit Project' : 'New Project'}
                    </h3>
                    <button onClick={onClose} disabled={isSubmitting}>
                        <X className="h-5 w-5 text-[#aaa] hover:text-white" />
                    </button>
                </div>

                <ProjectForm
                    project={project}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
