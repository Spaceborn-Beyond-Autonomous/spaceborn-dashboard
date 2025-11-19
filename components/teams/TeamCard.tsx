'use client';

import { useMemo } from 'react';
import { Users as UsersIcon } from 'lucide-react';
import { User } from '@/lib/types/users';
import { Team } from '@/lib/types/teams';
import TeamLead from './TeamLead';
import TeamMemberList from './TeamMemberList';

interface TeamCardProps {
    team: Team;
    users: User[];
}

export default function TeamCard({ team, users }: TeamCardProps) {
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
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-white">{team.name}</h3>
            </div>

            {/* Team Lead */}
            {teamLead && <TeamLead lead={teamLead} />}

            {/* Members */}
            <TeamMemberList members={teamMembers} />

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-[#222]">
                <p className="text-xs text-[#aaa]">
                    {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
                </p>
            </div>
        </div>
    );
}
