import TasksView from "@/components/tasks/TasksView";
import { CheckSquare } from "lucide-react";

export const metadata = {
  title: 'Tasks | Spaceborn',
  description: 'Manage project tasks and track progress.',
};

export default function TasksPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Client Logic */}
      <TasksView />
    </div>
  );
}