'use client';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { users } from '../../mock/mockData';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Users as UsersIcon } from 'lucide-react';

export default function Teams() {
  const { user } = useAuth();
  const { teams } = useData();

  if (!user) return null;

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown';
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Header title="Teams" />
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
              <div key={team.id} className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                </div>
                <div className="space-y-3">
                  {team.members.map(userId => {
                    const member = users.find(u => u.id === userId);
                    return (
                      <div key={userId} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-xs font-medium text-white">
                            {member?.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-white">{member?.name}</span>
                        </div>
                        <span className="text-xs bg-[#222] text-white px-2 py-1 rounded uppercase tracking-wide">
                          {member?.role}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-[#222]">
                  <p className="text-xs text-[#aaa]">{team.members.length} members</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}