'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { User } from '@/lib/types/users';
import { createTeam } from '@/lib/api/teams';

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    users: User[];
}

export default function CreateTeamModal({ isOpen, onClose, onSuccess, users }: CreateTeamModalProps) {
    const [teamName, setTeamName] = useState('');
    const [selectedLead, setSelectedLead] = useState<number | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Handle modal open/close with native dialog API
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTeamName('');
            setSelectedLead(null);
            setSelectedMembers([]);
            setError(null);
        }
    }, [isOpen]);

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const rect = dialog.getBoundingClientRect();
        const isInDialog =
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width;

        if (!isInDialog) {
            onClose();
        }
    };

    const handleMemberToggle = (userId: number) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!teamName.trim()) {
            setError('Team name is required');
            return;
        }

        try {
            setLoading(true);
            await createTeam({
                name: teamName.trim(),
                lead_id: selectedLead,
                member_ids: selectedMembers,
            });
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create team');
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            className="backdrop:bg-black/70 bg-transparent p-0 rounded-lg max-w-2xl w-full"
        >
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Create New Team</h2>
                    <button
                        onClick={onClose}
                        className="text-[#aaa] hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Team Name */}
                    <div>
                        <label htmlFor="teamName" className="block text-sm font-medium text-white mb-2">
                            Team Name *
                        </label>
                        <input
                            type="text"
                            id="teamName"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded text-white placeholder-[#666] focus:outline-none focus:border-white transition-colors"
                            placeholder="Enter team name"
                            required
                        />
                    </div>

                    {/* Team Lead */}
                    <div>
                        <label htmlFor="teamLead" className="block text-sm font-medium text-white mb-2">
                            Team Lead
                        </label>
                        <select
                            id="teamLead"
                            value={selectedLead || ''}
                            onChange={(e) => setSelectedLead(e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded text-white focus:outline-none focus:border-white transition-colors"
                        >
                            <option value="">Select a team lead (optional)</option>
                            {users.map((user) => (
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
                        <div className="max-h-48 overflow-y-auto space-y-2 border border-[#333] rounded p-3 bg-[#1a1a1a]">
                            {users.length === 0 ? (
                                <p className="text-sm text-[#666]">No users available</p>
                            ) : (
                                users.map((user) => (
                                    <label
                                        key={user.id}
                                        className="flex items-center gap-3 p-2 hover:bg-[#222] rounded cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(user.id)}
                                            onChange={() => handleMemberToggle(user.id)}
                                            className="w-4 h-4 rounded border-[#333] bg-[#1a1a1a] text-white focus:ring-2 focus:ring-white"
                                        />
                                        <div className="flex items-center gap-2 flex-1">
                                            <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-xs font-medium text-white">
                                                {user.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm text-white">{user.username}</p>
                                                <p className="text-xs text-[#666]">{user.role}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                        {selectedMembers.length > 0 && (
                            <p className="text-xs text-[#aaa] mt-2">
                                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-[#333] rounded text-white hover:border-white transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Team'}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
