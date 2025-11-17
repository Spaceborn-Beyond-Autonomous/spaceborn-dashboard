'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listTasks, updateTask } from '@/lib/api/tasks';
import { listUsers } from '@/lib/api/users';
import { Task, TaskStatus } from '@/lib/types/tasks';
import { User } from '@/lib/types/users';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Constants
const STATUS_OPTIONS: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'Pending',
  'in_progress': 'In Progress',
  'done': 'Completed',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  'todo': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  'in_progress': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  'done': 'bg-green-500/20 text-green-400 border-green-500/50',
};

// Helper functions
const getStatusColor = (status: TaskStatus): string => {
  return STATUS_COLORS[status] || 'bg-[#222] text-white border-white';
};

const getStatusLabel = (status: TaskStatus): string => {
  return STATUS_LABELS[status] || status;
};

// Sub-components
interface StatusBadgeProps {
  status: TaskStatus;
  canEdit: boolean;
  onStatusChange: (newStatus: TaskStatus) => void;
}

const StatusBadge = ({ status, canEdit, onStatusChange }: StatusBadgeProps) => {
  if (!canEdit) {
    return (
      <span className={`inline-block px-3 py-1.5 rounded-md text-xs font-medium border ${getStatusColor(status)}`}>
        {getStatusLabel(status)}
      </span>
    );
  }

  return (
    <Select value={status} onValueChange={(value) => onStatusChange(value as TaskStatus)}>
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
            {getStatusLabel(option)}
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks and users
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, usersData] = await Promise.all([
        listTasks(),
        listUsers(),
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper to get user name
  const getUserName = useCallback((userId: number): string => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser?.username ?? 'Unknown';
  }, [users]);

  // Memoized permission checker
  const canEditTask = useCallback((task: Task) => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'core' || task.assignee_id === user.id;
  }, [user]);

  // Status change handler with API call
  const handleStatusChange = useCallback(async (taskId: number, newStatus: TaskStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      // Update local state optimistically
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Optionally refetch to ensure consistency
      fetchData();
    }
  }, [fetchData]);

  // Memoized task statistics
  const taskStats = useMemo(() => ({
    pending: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    completed: tasks.filter(task => task.status === 'done').length,
  }), [tasks]);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Early return if no user
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#aaa]">Please log in to view tasks</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#aaa]">Loading tasks...</p>
      </div>
    );
  }

  return (
    <main className="p-6">
      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Assigned To</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Created</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr
                    key={task.id}
                    className={`${index % 2 === 0 ? 'bg-[#111]' : 'bg-[#0a0a0a]'} hover:bg-[#1a1a1a] transition-colors`}
                  >
                    <td className="py-3 px-4 text-white font-medium">{task.title}</td>
                    <td className="py-3 px-4 text-[#aaa] text-sm max-w-xs truncate">
                      {task.description || 'No description'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={task.status}
                        canEdit={canEditTask(task)}
                        onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                      />
                    </td>
                    <td className="py-3 px-4 text-[#aaa]">
                      {task.assignee_id ? getUserName(task.assignee_id) : 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 text-[#aaa] text-sm">
                      {formatDate(task.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
