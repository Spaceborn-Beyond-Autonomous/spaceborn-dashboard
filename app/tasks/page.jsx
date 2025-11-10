'use client';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { users } from '../../mock/mockData';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, updateTaskStatus } = useData();

  if (!user) return null;

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown';
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const canEditTask = (task) => {
    return user.role === 'admin' || user.role === 'core' || task.assignedTo === user.id;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Header title="Tasks" />
        <main className="p-6">
          <div className="bg-[#111] border border-[#222] rounded overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#000] border-b border-[#222]">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Task</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Assigned To</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Deadline</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#aaa]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task.id} className={index % 2 === 0 ? 'bg-[#111]' : 'bg-[#0a0a0a]'}>
                    <td className="py-3 px-4 text-white">{task.title}</td>
                    <td className="py-3 px-4">
                      <span className="bg-[#222] px-2 py-1 rounded text-xs text-white">
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#aaa]">{getUserName(task.assignedTo)}</td>
                    <td className="py-3 px-4 text-[#aaa]">{task.deadline}</td>
                    <td className="py-3 px-4">
                      {canEditTask(task) && (
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className="bg-[#000] text-white text-xs px-2 py-1 rounded border border-white outline-none transition-all"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111] border border-[#222] rounded p-6">
              <h3 className="text-sm text-[#aaa] mb-2">Pending Tasks</h3>
              <div className="text-3xl font-semibold text-white mb-2">
                {tasks.filter(task => task.status === 'Pending').length}
              </div>
              <div className="text-xs text-[#aaa]">Tasks waiting to start</div>
            </div>
            
            <div className="bg-[#111] border border-[#222] rounded p-6">
              <h3 className="text-sm text-[#aaa] mb-2">In Progress</h3>
              <div className="text-3xl font-semibold text-white mb-2">
                {tasks.filter(task => task.status === 'In Progress').length}
              </div>
              <div className="text-xs text-[#aaa]">Currently active tasks</div>
            </div>
            
            <div className="bg-[#111] border border-[#222] rounded p-6">
              <h3 className="text-sm text-[#aaa] mb-2">Completed</h3>
              <div className="text-3xl font-semibold text-white mb-2">
                {tasks.filter(task => task.status === 'Completed').length}
              </div>
              <div className="text-xs text-[#aaa]">Finished tasks</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}