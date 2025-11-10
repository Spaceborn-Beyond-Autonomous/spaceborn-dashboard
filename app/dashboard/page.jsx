'use client';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { TrendingUp, CheckCircle2, FolderKanban, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { projects, tasks, revenue } = useData();

  if (!user) return null;

  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const runningProjects = projects.filter(project => project.status === 'Running').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Header title="Dashboard" />
        <main className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#aaa]">Running Tasks</span>
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-semibold text-white">{tasks.filter(t => t.status === 'In Progress').length}</div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#aaa]">Pending Tasks</span>
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-semibold text-white">{pendingTasks}</div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#aaa]">Completed Tasks</span>
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-semibold text-white">{completedTasks}</div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#aaa]">Active Projects</span>
                <FolderKanban className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-semibold text-white">{runningProjects}</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[#111] border border-[#222] rounded p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Task Summary</h3>
              <div className="space-y-3">
                {tasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{task.title}</p>
                      <p className="text-xs text-[#aaa]">{task.assignee}</p>
                    </div>
                    <span className="bg-[#222] px-2 py-1 rounded text-xs text-white">{task.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Project Snapshot</h3>
              <div className="space-y-3">
                {projects.slice(0, 5).map(project => (
                  <div key={project.id} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{project.name}</p>
                      <p className="text-xs text-[#aaa]">{project.team}</p>
                    </div>
                    <span className="bg-[#222] px-2 py-1 rounded text-xs text-white">{project.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
