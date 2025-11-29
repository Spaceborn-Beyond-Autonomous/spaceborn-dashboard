'use client';

import { useState, useEffect } from 'react';
import { X, Save, Users, Loader2, Check } from 'lucide-react';
import { Team } from '@/lib/types/teams';
import { User } from '@/lib/types/users';
import { cn } from '@/lib/utils';

interface EditTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedTeam: Partial<Team>) => void;
    team: Team;
    users: User[];
}

export default function EditTeamModal({
    isOpen,
    onClose,
    onSuccess,
    team,
    users,
}: EditTeamModalProps) {
    const [name, setName] = useState('');
    const [leadId, setLeadId] = useState<number | null>(null);
    const [memberIds, setMemberIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize form with team data
    useEffect(() => {
        if (isOpen && team) {
            setName(team.name);
            setLeadId(team.lead_id || null);
            setMemberIds(team.member_ids || []);
            setError(null);
        }
    }, [isOpen, team]);

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Team name is required');
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedData: Partial<Team> = {
                name: name.trim(),
                lead_id: leadId,
                member_ids: memberIds,
            };

            await onSuccess(updatedData);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update team');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMember = (userId: number) => {
        setMemberIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className={cn(
                    "w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 flex flex-col max-h-[90vh]",
                    "animate-in zoom-in-95 duration-200"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/30 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <Users className="h-5 w-5 text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-zinc-100">Edit Team</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-zinc-500 hover:text-zinc-100 transition-colors p-1 hover:bg-zinc-800 rounded-md disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                    {/* Error Display */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Team Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Team Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all disabled:opacity-50"
                            placeholder="Enter team name"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Team Lead */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Team Lead
                        </label>
                        <div className="relative">
                            <select
                                value={leadId || ''}
                                onChange={(e) => setLeadId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all cursor-pointer disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                <option value="" className="bg-zinc-900 text-zinc-400">Select a lead...</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id} className="bg-zinc-900 text-zinc-100">
                                        {user.username} ({user.role})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none border-t-4 border-l-4 border-transparent border-t-zinc-500" />
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Select Members
                            </label>
                            <span className="text-xs text-indigo-400 font-medium">
                                {memberIds.length} selected
                            </span>
                        </div>

                        <div className={cn(
                            "max-h-48 overflow-y-auto space-y-1 p-1 pr-2 border border-zinc-800 rounded-lg bg-zinc-900/30",
                            // Modern Scrollbar Styles
                            "[&::-webkit-scrollbar]:w-1.5",
                            "[&::-webkit-scrollbar-track]:bg-zinc-900/30",
                            "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
                            "[&::-webkit-scrollbar-thumb]:rounded-full",
                            "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
                        )}>
                            {users.map(user => {
                                const isSelected = memberIds.includes(user.id);
                                return (
                                    <label
                                        key={user.id}
                                        className={cn(
                                            "flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-all border",
                                            isSelected
                                                ? "bg-indigo-500/10 border-indigo-500/30"
                                                : "hover:bg-zinc-800/50 border-transparent"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                                            isSelected
                                                ? "bg-indigo-500 border-indigo-500"
                                                : "border-zinc-600 bg-zinc-900"
                                        )}>
                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleMember(user.id)}
                                            disabled={isSubmitting}
                                            className="hidden"
                                        />
                                        <span className={cn("text-sm font-medium", isSelected ? "text-indigo-200" : "text-zinc-200")}>
                                            {user.username} <span className="text-zinc-500 font-normal">({user.role})</span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}