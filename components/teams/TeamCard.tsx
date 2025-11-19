'use client';

import { useState, useMemo } from 'react';
import { Users as UsersIcon, Edit2, Trash2 } from 'lucide-react';
import { User } from '@/lib/types/users';
import { Team } from '@/lib/types/teams';
import TeamLead from './TeamLead';

interface TeamCardProps {
    team: Team;
    users: User[];
    onEdit: (team: Team) => void;
    onDelete: (team: Team) => void;
}

export default function TeamCard({ team, users, onEdit, onDelete }: TeamCardProps) {
    const teamMembers = useMemo(() => {
        if (team.members && team.members.length > 0 && typeof team.members[0] === 'object') {
            return team.members as User[];
        }
        if (team.member_ids && team.member_ids?.length > 0) {
            return team.member_ids
                .map(id => users.find(u => u.id === id))
                .filter((u): u is User => u !== undefined);
        }
        return [];
    }, [team, users]);

    const teamLead = useMemo(() => {
        if (team.lead) return team.lead;
        if (team.lead_id) {
            return users.find(u => u.id === team.lead_id) || null;
        }
        return null;
    }, [team, users]);

    return (
        <div className="bg-[#111] border border-[#222] rounded p-6 hover:border-white transition-all duration-200 shadow-md shadow-[#111]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-black" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(team)}
                        className="p-2 text-[#aaa] hover:text-white hover:bg-[#222] rounded transition-colors"
                        title="Edit team"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(team)}
                        className="p-2 text-[#aaa] hover:text-red-500 hover:bg-[#222] rounded transition-colors"
                        title="Delete team"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Team Lead */}
            {teamLead && <TeamLead lead={teamLead} />}

            {/* Footer - Just show count */}
            <div className="mt-4 pt-4 border-t border-[#222]">
                <p className="text-xs text-[#aaa]">
                    {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
                </p>
            </div>
        </div>
    );
}
