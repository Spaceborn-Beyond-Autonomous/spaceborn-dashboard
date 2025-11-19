'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Team } from '@/lib/types/teams';
import { User } from '@/lib/types/users';

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-[#111] border border-[#222] rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Edit Team</h2>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-[#aaa] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Team Name */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Team Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-black border border-[#222] rounded text-white focus:outline-none focus:border-white"
                            placeholder="Enter team name"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Team Lead */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Team Lead
                        </label>
                        <select
                            value={leadId || ''}
                            onChange={(e) => setLeadId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-3 py-2 bg-black border border-[#222] rounded text-white focus:outline-none focus:border-white"
                            disabled={isSubmitting}
                        >
                            <option value="">Select a lead</option>
                            {users
                                .map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.username} ({user.role})
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Team Members */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Team Members
                        </label>
                        <div className="max-h-48 overflow-y-auto bg-black border border-[#222] rounded p-3 space-y-2">
                            {users.map(user => (
                                <label
                                    key={user.id}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-[#111] p-2 rounded transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={memberIds.includes(user.id)}
                                        onChange={() => toggleMember(user.id)}
                                        disabled={isSubmitting}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm text-white">
                                        {user.username} <span className="text-[#aaa]">({user.role})</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-[#222]">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#222] text-white rounded hover:bg-[#333] transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
