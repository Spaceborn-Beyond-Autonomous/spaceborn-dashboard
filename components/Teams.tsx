'use client';

import { useState, useEffect } from 'react';
import { listTeams } from '@/lib/api/teams';
import { listUsers } from '@/lib/api/users';
import Sidebar from './Sidebar';
import Header from './Header';
import { Users as UsersIcon } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'core' | 'employee';
}

interface Team {
    id: string;
    name: string;
    members: string[];
}

interface TeamsClientProps {
    initialTeams: Team[];
    initialUsers: User[];
    user: User;
}

export default function TeamsClient({ initialTeams, initialUsers, user }: TeamsClientProps) {
    const [teams, setTeams] = useState(initialTeams);
    const [users, setUsers] = useState(initialUsers);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const [teamsData, usersData] = await Promise.all([
                    listTeams(),
                    listUsers(),
                ]);
                setTeams(teamsData);
                setUsers(usersData);
            } catch (error) {
                console.error('Failed to refresh data:', error);
            }
        }, 10000); // Refresh every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar user={user} />
            <div className="flex-1 md:ml-64">
                <Header title="Teams" user={user} />
                <main className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.map((team: Team) => (
                            <div
                                key={team.id}
                                className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                        <UsersIcon className="h-5 w-5 text-black" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                                </div>

                                <div className="space-y-3">
                                    {team.members.map((userId: string) => {
                                        const member = users.find((u: User) => u.id === userId);
                                        if (!member) return null;

                                        return (
                                            <div
                                                key={userId}
                                                className="flex items-center justify-between py-2 border-b border-[#222] last:border-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-xs font-medium text-white">
                                                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <span className="text-sm text-white">{member.name}</span>
                                                </div>
                                                <span className="text-xs bg-[#222] text-white px-2 py-1 rounded uppercase tracking-wide">
                                                    {member.role}
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
