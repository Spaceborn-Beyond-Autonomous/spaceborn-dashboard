'use client';

import { useMemo } from 'react';
import { Users as UsersIcon, Edit2, Trash2, MoreHorizontal, User as UserIcon } from 'lucide-react';
import { User } from '@/lib/types/users';
import { Team } from '@/lib/types/teams';
import TeamLead from './TeamLead';
import { cn } from '@/lib/utils';

interface TeamCardProps {
    team: Team;
    users: User[];
    onEdit: (team: Team) => void;
    onDelete: (team: Team) => void;
    onClick: (team: Team) => void;
}

export default function TeamCard({ team, users, onEdit, onDelete, onClick }: TeamCardProps) {
    // Memoize team members calculation
    const teamMembers = useMemo(() => {
        if (team.members && team.members.length > 0 && typeof team.members[0] === 'object') {
            return team.members as User[];
        }
        if (team.member_ids && team.member_ids.length > 0) {
            return team.member_ids
                .map(id => users.find(u => u.id === id))
                .filter((u): u is User => u !== undefined);
        }
        return [];
    }, [team, users]);

    // Memoize team lead calculation
    const teamLead = useMemo(() => {
        if (team.lead) return team.lead;
        if (team.lead_id) {
            return users.find(u => u.id === team.lead_id) || null;
        }
        return null;
    }, [team, users]);

    // Helper for avatar initials
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div
            onClick={() => onClick(team)}
            className="group relative flex flex-col justify-between p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 cursor-pointer"
        >

            {/* Header: Icon + Name + Actions */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
                        <UsersIcon className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-100 leading-tight group-hover:text-white transition-colors">
                            {team.name}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">
                            Created {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Hover Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(team); }}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                        title="Edit team"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(team); }}
                        className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Delete team"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Body Content */}
            <div className="space-y-6">

                {/* Team Lead (Uses Sub-Component) */}
                {teamLead ? (
                    <TeamLead lead={teamLead} />
                ) : (
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                            Team Lead
                        </label>
                        <div className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-zinc-800 text-zinc-500 text-sm bg-zinc-900/20">
                            <UserIcon className="h-4 w-4" />
                            <span>No lead assigned</span>
                        </div>
                    </div>
                )}

                {/* Members Stack */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                            Members
                        </label>
                        <span className="text-xs text-zinc-400">
                            {teamMembers.length} active
                        </span>
                    </div>

                    <div className="flex items-center pl-2 h-8">
                        {teamMembers.length > 0 ? (
                            <>
                                {teamMembers.slice(0, 5).map((member) => (
                                    <div
                                        key={member.id}
                                        className="relative -ml-2 hover:z-10 transition-transform hover:-translate-y-1 cursor-help"
                                        title={`${member.username} (${member.role})`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] text-zinc-300 font-medium overflow-hidden">
                                            {getInitials(member.username)}
                                        </div>
                                    </div>
                                ))}
                                {teamMembers.length > 5 && (
                                    <div className="relative -ml-2 z-0">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] text-zinc-400 font-medium">
                                            <MoreHorizontal className="h-3 w-3" />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-zinc-600 italic -ml-2">No members yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}