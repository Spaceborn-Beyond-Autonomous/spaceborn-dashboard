'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { users } from '../../mock/mockData';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Plus, X } from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const { projects, addProject, deleteProject } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', status: 'Planning', assignedTo: [] });

  if (!user || (user.role !== 'admin' && user.role !== 'core')) {
    return <div className="text-white p-6">Access denied</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject(formData);
    setFormData({ name: '', status: 'Planning', assignedTo: [] });
    setShowForm(false);
  };

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown';
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Header title="Projects" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">All Projects</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-black px-4 py-2 rounded hover:bg-[#aaa] transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </div>

          {showForm && (
            <div className="bg-[#111] border border-[#222] rounded p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Add New Project</h3>
                <button onClick={() => setShowForm(false)} className="text-[#aaa] hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-[#000] text-white border border-[#222] rounded focus:border-white outline-none transition-all"
                  required
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-[#000] text-white border border-[#222] rounded focus:border-white outline-none transition-all"
                >
                  <option value="Planning">Planning</option>
                  <option value="Running">Running</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="flex gap-2">
                  <button type="submit" className="bg-white text-black px-4 py-2 rounded hover:bg-[#aaa] transition-all">
                    Add
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="bg-[#222] text-white px-4 py-2 rounded hover:bg-[#333] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <div key={project.id} className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  <span className="bg-[#222] px-2 py-1 rounded text-xs text-white">{project.status}</span>
                </div>
                <p className="text-sm text-[#aaa] mb-2">Team: {project.team}</p>
                <p className="text-xs text-[#aaa] mb-4">
                  {project.assignedTo.map(userId => getUserName(userId)).join(', ')}
                </p>
                {user.role === 'admin' && (
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-sm text-[#aaa] hover:text-white transition-all"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}