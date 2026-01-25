// components/projects/TopicSection.tsx
import { ChevronDown, ChevronRight, Plus, FolderKanban } from 'lucide-react';
import { Project, Topic } from '@/lib/types/projects';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/utils';

interface TopicSectionProps {
    topic: Topic;
    onToggle: () => void;
    onAddProject: (topic: Topic) => void;
    onEditProject: (topic: Topic | null, project: Project) => void;
    onDeleteProject: (id: number) => void;
}

export function TopicSection({ 
    topic, 
    onToggle, 
    onAddProject, 
    onEditProject, 
    onDeleteProject 
}: TopicSectionProps) {
    return (
        <div className="group/topic">
            {/* Topic Header */}
            <div className="flex items-center justify-between p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 cursor-pointer"
                 onClick={onToggle}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover/topic:bg-indigo-500/20 transition-all">
                        <FolderKanban className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-100">{topic.name}</h3>
                        <p className="text-xs text-zinc-500">
                            {topic.projects.length} project{topic.projects.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {topic.projects.length > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddProject(topic);
                            }}
                            className="p-2 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 rounded-lg transition-all opacity-0 group-hover/topic:opacity-100"
                            title="Add project to this topic"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    )}
                    <div className={cn(
                        "p-2 rounded-lg bg-zinc-800/50 text-zinc-400 transition-all duration-300",
                        topic.open ? "rotate-180" : ""
                    )}>
                        {topic.open ? (
                            <ChevronDown className="h-5 w-5" />
                        ) : (
                            <ChevronRight className="h-5 w-5" />
                        )}
                    </div>
                </div>
            </div>

            {/* Topic Projects */}
            {topic.open && topic.projects.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-4 border-l-2 border-indigo-500/30">
                    {topic.projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={() => onEditProject(topic, project)}
                            onDelete={onDeleteProject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
