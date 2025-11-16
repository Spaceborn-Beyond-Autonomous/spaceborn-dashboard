'use client';
import { useMemo, useCallback, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { users } from '@/mock/mockData';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Constants
const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'] as const;
type TaskStatus = typeof STATUS_OPTIONS[number];

const STATUS_COLORS: Record<TaskStatus, string> = {
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  'Completed': 'bg-green-500/20 text-green-400 border-green-500/50',
};

// Helper functions
const getUserName = (userId: number): string => {
  const foundUser = users.find(u => u.id === userId);
  return foundUser?.name ?? 'Unknown';
};

const getStatusColor = (status: TaskStatus): string => {
  return STATUS_COLORS[status] || 'bg-[#222] text-white border-white';
};

// Sub-components
interface StatusBadgeProps {
  status: TaskStatus;
  canEdit: boolean;
  onStatusChange: (newStatus: string) => void;
}

const StatusBadge = ({ status, canEdit, onStatusChange }: StatusBadgeProps) => {
  if (!canEdit) {
    return (
      <span className={`inline-block px-3 py-1.5 rounded-md text-xs font-medium border ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  }

  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className={`w-[140px] h-8 text-xs font-medium px-3 rounded-md border outline-none cursor-pointer transition-all hover:brightness-110 ${getStatusColor(status)}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-[#1a1a1a] border border-[#333] rounded-md shadow-xl min-w-[140px]">
        {STATUS_OPTIONS.map(option => (
          <SelectItem
            key={option}
            className={`cursor-pointer transition-all hover:brightness-125 focus:brightness-125 text-xs font-medium mb-1 mt-1 px-3 py-2 ${getStatusColor(option)}`}
            value={option}
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface StatCardProps {
  title: string;
  count: number;
  description: string;
}

const StatCard = ({ title, count, description }: StatCardProps) => (
  <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-[#333] transition-colors">
    <h3 className="text-sm text-[#aaa] mb-2">{title}</h3>
    <div className="text-3xl font-semibold text-white mb-2">{count}</div>
    <div className="text-xs text-[#aaa]">{description}</div>
  </div>
);

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, updateTaskStatus } = useData();

  // Memoized permission checker
  const canEditTask = useCallback((task: any) => {
    if (!user) return false;
    return (user as any).role === 'admin' || (user as any).role === 'core' || task.assignedTo === user.id;
  }, [user]);

  // Memoized status change handler
  const handleStatusChange = useCallback((taskId: number, newStatus: string) => {
    updateTaskStatus(taskId, newStatus);
  }, [updateTaskStatus]);

  // Memoized task statistics
  const taskStats = useMemo(() => ({
    pending: tasks.filter((task: { status: string; }) => task.status === 'Pending').length,
    inProgress: tasks.filter((task: { status: string; }) => task.status === 'In Progress').length,
    completed: tasks.filter((task: { status: string; }) => task.status === 'Completed').length,
  }), [tasks]);

  // Early return if no user
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#aaa]">Please log in to view tasks</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar user={user as any} />
      <div className="flex-1 md:ml-64">
        <Header title="Tasks" user={user as any} />
        <main className="p-6">
          {/* Tasks Table */}
          <div className="bg-[#111] border border-[#222] rounded overflow-hidden">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-[#aaa]">
                No tasks available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black border-b border-[#222]">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Task</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Assigned To</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task: { id: number; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: TaskStatus; assignedTo: number; deadline: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: number) => (
                      <tr
                        key={task.id}
                        className={`${index % 2 === 0 ? 'bg-[#111]' : 'bg-[#0a0a0a]'} hover:bg-[#1a1a1a] transition-colors`}
                      >
                        <td className="py-3 px-4 text-white font-medium">{task.title}</td>
                        <td className="py-3 px-4">
                          <StatusBadge
                            status={task.status}
                            canEdit={canEditTask(task)}
                            onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                          />
                        </td>
                        <td className="py-3 px-4 text-[#aaa]">{getUserName(task.assignedTo)}</td>
                        <td className="py-3 px-4 text-[#aaa]">{task.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Pending Tasks"
              count={taskStats.pending}
              description="Tasks waiting to start"
            />
            <StatCard
              title="In Progress"
              count={taskStats.inProgress}
              description="Currently active tasks"
            />
            <StatCard
              title="Completed"
              count={taskStats.completed}
              description="Finished tasks"
            />
          </div>
        </main>
      </div>
    </div>
  );
}