'use client';

import { useState, useEffect } from 'react';
import { listTeams } from '@/lib/api/teams';
import { listUsers } from '@/lib/api/users';
import { Users as UsersIcon } from 'lucide-react';
import { User } from '@/lib/types/users';
import { Team } from '@/lib/types/teams';

interface TeamsClientProps {
    initialTeams: Team[];
    initialUsers: User[];
    user: User;
}

export default function TeamsClient({ initialTeams, initialUsers, user }: TeamsClientProps) {
    const [teams, setTeams] = useState<Team[]>(initialTeams);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [teamsData, usersData] = await Promise.all([
                    listTeams(),
                    listUsers(),
                ]);
                setTeams(teamsData);
                setUsers(usersData);
            } catch (error) {
                console.error('Failed to refresh data:', error);
            } finally {
                setLoading(false);
            }
        };

        const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds

        return () => clearInterval(interval);
    }, []);

    // Helper function to get team members
    const getTeamMembers = (team: Team): User[] => {
        // If members are already populated as User objects
        if (team.members && team.members.length > 0 && typeof team.members[0] === 'object') {
            return team.members as User[];
        }

        // If member_ids are provided as numbers
        if (team.member_ids && team.member_ids.length > 0) {
            return team.member_ids
                .map(id => users.find(u => u.id === id))
                .filter((u): u is User => u !== undefined);
        }

        return [];
    };

    // Helper to get lead user
    const getTeamLead = (team: Team): User | null => {
        if (team.lead) return team.lead;
        if (team.lead_id) {
            return users.find(u => u.id === team.lead_id) || null;
        }
        return null;
    };

    if (teams.length === 0) {
        return (
            <main className="p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <UsersIcon className="h-16 w-16 text-[#aaa] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Teams Found</h3>
                        <p className="text-[#aaa]">There are no teams available at the moment.</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => {
                    const teamMembers = getTeamMembers(team);
                    const teamLead = getTeamLead(team);

                    return (
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

                            {teamLead && (
                                <div className="mb-4 p-3 bg-[#1a1a1a] rounded border border-[#333]">
                                    <p className="text-xs text-[#aaa] mb-2">Team Lead</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-semibold text-black">
                                            {teamLead.username.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-sm text-white font-medium">{teamLead.username}</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {teamMembers.length === 0 ? (
                                    <p className="text-sm text-[#aaa] text-center py-4">No members yet</p>
                                ) : (
                                    teamMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between py-2 border-b border-[#222] last:border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-xs font-medium text-white">
                                                    {member.username.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-sm text-white">{member.username}</span>
                                            </div>
                                            <span className="text-xs bg-[#222] text-white px-2 py-1 rounded uppercase tracking-wide">
                                                {member.role}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#222]">
                                <p className="text-xs text-[#aaa]">{teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
