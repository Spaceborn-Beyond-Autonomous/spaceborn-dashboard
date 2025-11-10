'use client';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, CheckCircle2, FolderKanban, DollarSign, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { projects, tasks, teams, revenue } = useData();

  if (!user) return null;

  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const runningProjects = projects.filter(project => project.status === 'Running').length;

  const projectStatusData = [
    { name: 'Running', value: projects.filter(p => p.status === 'Running').length },
    { name: 'Planning', value: projects.filter(p => p.status === 'Planning').length },
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length },
  ];

  const taskStatusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'Running': 'success',
      'Completed': 'success',
      'Planning': 'warning',
      'In Progress': 'info',
      'Pending': 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="flex min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <Sidebar />
      <div className="flex-1 md:ml-64 relative z-10">
        <Header title="Dashboard" />
        <main className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Across all teams</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Running Projects</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{runningProjects}</div>
                <p className="text-xs text-muted-foreground">Active development</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 hover:border-pink-500/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <Clock className="h-4 w-4 text-pink-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.length}</div>
                <p className="text-xs text-muted-foreground">All assignments</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks}</div>
                <p className="text-xs text-muted-foreground">{Math.round((completedTasks/tasks.length)*100)}% completion rate</p>
              </CardContent>
            </Card>
          </div>

          {user.role === 'admin' && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="glass-card border-white/10 hover:border-emerald-500/30 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${revenue.total.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">All projects combined</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-yellow-500/30 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${revenue.pending.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Awaiting completion</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Revenue</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${revenue.completed.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Delivered projects</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Project Status Overview</CardTitle>
                <CardDescription>Distribution of projects by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={projectStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }} />
                    <Bar dataKey="value" fill="url(#colorGradient)" />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Task Status Overview</CardTitle>
                <CardDescription>Distribution of tasks by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={taskStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Latest project updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 5).map(project => (
                    <div key={project.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.team}</p>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Latest task assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.assignee}</p>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
