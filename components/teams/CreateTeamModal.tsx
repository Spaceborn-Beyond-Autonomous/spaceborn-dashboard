'use client';

import { useState, useEffect } from 'react';
import { X, Users, Loader2, Check } from 'lucide-react';
import { User } from '@/lib/types/users';
import { createTeam } from '@/lib/api/teams';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

    // Close on Escape key press
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTeamName('');
            setSelectedLead(null);
            setSelectedMembers([]);
        }
    }, [isOpen]);

    const handleMemberToggle = (userId: number) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!teamName.trim()) {
            toast.error('Team name is required');
            return;
        }

        try {
            setLoading(true);
            await createTeam({
                name: teamName.trim(),
                lead_id: selectedLead,
                member_ids: selectedMembers,
            });
            toast.success("Team created successfully");
            onSuccess();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to create team');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className={cn(
                    "w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50 flex flex-col max-h-[90vh]",
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
                        <h2 className="text-lg font-semibold text-zinc-100">Create New Team</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-100 transition-colors p-1 hover:bg-zinc-800 rounded-md"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className={cn(
                        "p-6 space-y-6 overflow-y-auto",
                        // Modern Scrollbar Styles
                        "[&::-webkit-scrollbar]:w-2",
                        "[&::-webkit-scrollbar-track]:bg-zinc-900/50",
                        "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
                        "[&::-webkit-scrollbar-thumb]:rounded-full",
                        "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
                    )}
                >
                    {/* Team Name */}
                    <div className="space-y-1.5">
                        <label htmlFor="teamName" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Team Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="teamName"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full px-3 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                            placeholder="e.g. Engineering Alpha"
                            required
                        />
                    </div>

                    {/* Team Lead - Replaced Native Select with Custom Select */}
                    <div className="space-y-1.5">
                        <label htmlFor="teamLead" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Team Lead
                        </label>
                        <Select
                            value={selectedLead ? String(selectedLead) : ""}
                            onValueChange={(val) => setSelectedLead(val === 'unassigned' ? null : Number(val))}
                        >
                            <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500/50">
                                <SelectValue placeholder="Select a team lead..." />
                            </SelectTrigger>
                            <SelectContent
                                className={cn(
                                    "bg-zinc-950 border-zinc-800 text-zinc-100 max-h-[200px]",
                                    // Custom Scrollbar for Dropdown
                                    "[&::-webkit-scrollbar]:w-1.5",
                                    "[&::-webkit-scrollbar-track]:bg-zinc-900/30",
                                    "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
                                    "[&::-webkit-scrollbar-thumb]:rounded-full",
                                    "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
                                )}
                            >
                                <SelectItem value="unassigned" className="text-zinc-400 italic focus:bg-zinc-900 focus:text-zinc-300">
                                    No Lead Assigned
                                </SelectItem>
                                {users.map((user) => (
                                    <SelectItem
                                        key={user.id}
                                        value={String(user.id)}
                                        className="focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2">
                                            {user.username}
                                            <span className="text-zinc-500 text-xs uppercase">({user.role})</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Team Members Selection */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Select Members
                            </label>
                            <span className="text-xs text-indigo-400 font-medium">
                                {selectedMembers.length} selected
                            </span>
                        </div>

                        <div className={cn(
                            "max-h-56 overflow-y-auto space-y-1 p-1 pr-2 border border-zinc-800 rounded-lg bg-zinc-900/30",
                            // Modern Scrollbar Styles applied here
                            "[&::-webkit-scrollbar]:w-1.5",
                            "[&::-webkit-scrollbar-track]:bg-zinc-900/30",
                            "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
                            "[&::-webkit-scrollbar-thumb]:rounded-full",
                            "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
                        )}>
                            {users.length === 0 ? (
                                <p className="text-sm text-zinc-500 p-4 text-center">No users available</p>
                            ) : (
                                users.map((user) => {
                                    const isSelected = selectedMembers.includes(user.id);
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
                                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                isSelected
                                                    ? "bg-indigo-500 border-indigo-500"
                                                    : "border-zinc-600 bg-zinc-900"
                                            )}>
                                                {isSelected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleMemberToggle(user.id)}
                                                className="hidden"
                                            />
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 border border-zinc-700 shrink-0">
                                                    {user.username.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="truncate">
                                                    <p className={cn("text-sm font-medium truncate", isSelected ? "text-indigo-200" : "text-zinc-200")}>
                                                        {user.username}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{user.role}</p>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Team'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}