'use client';

import { useEffect, useMemo } from 'react';
import { X, Users, Calendar } from 'lucide-react';
import { Team } from '@/lib/types/teams';
import { User } from '@/lib/types/users';
import TeamLead from './TeamLead';
import TeamMemberList from './TeamMemberList';
import { cn } from '@/lib/utils';

interface TeamDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    team: Team | null;
    users: User[];
}

export default function TeamDetailsModal({ isOpen, onClose, team, users }: TeamDetailsModalProps) {

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const teamLead = useMemo(() => {
        if (!team) return null;
        if (team.lead) return team.lead;
        if (team.lead_id) return users.find(u => u.id === team.lead_id) || null;
        return null;
    }, [team, users]);

    const teamMembers = useMemo(() => {
        if (!team) return [];
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

    if (!isOpen || !team) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className={cn(
                    "w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50",
                    "animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-zinc-800/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                            <Users className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-100 leading-tight">
                                {team.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                                <Calendar className="h-3 w-3" />
                                <span>Created {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">

                    {/* Lead Section */}
                    {teamLead && (
                        <div className="space-y-3">
                            <TeamLead lead={teamLead} />
                        </div>
                    )}

                    {/* Members List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                                Team Roster
                                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium">
                                    {teamMembers.length}
                                </span>
                            </h4>
                        </div>
                        <div className="bg-zinc-900/30 rounded-xl border border-zinc-800/50 overflow-hidden">
                            <TeamMemberList members={teamMembers} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}