'use client';

import { useState, useMemo } from 'react';
import { X, UserCheck, User as UserIcon, Plus, Check, Search, Loader2 } from 'lucide-react';
import { useMeetingAttendance } from '@/hooks/useAttendance';
import type { Meeting } from '@/lib/types/meetings';
import type { User } from '@/lib/types/users';
import { cn } from '@/lib/utils';

interface AttendanceModalProps {
    meeting: Meeting;
    onClose: () => void;
    allUsers: User[];
}

export default function AttendanceModal({ meeting, onClose, allUsers }: AttendanceModalProps) {
    const { attendance, addAttendance } = useMeetingAttendance(meeting.id);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate quick stats
    const stats = useMemo(() => {
        const total = attendance.length;
        const present = attendance.filter(a => a.attended).length;
        return { total, present };
    }, [attendance]);

    // Filter users for the selection list
    const filteredUsers = useMemo(() => {
        return allUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allUsers, searchTerm]);

    const toggleUserSelection = (userId: number) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUserIds.length === 0) return;

        setIsSubmitting(true);
        // FIX: Changed key from 'user_ids' to 'attendees' to match backend schema
        // The backend explicitly looks for payload.attendees
        const success = await addAttendance({ attendees: selectedUserIds });
        if (success) {
            setSelectedUserIds([]);
            setSearchTerm('');
        }
        setIsSubmitting(false);
    };

    // Helper to get user details
    const getUserDetails = (userId: number) => {
        return allUsers.find(u => u.id === userId);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className={cn(
                    "bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]",
                    "animate-in zoom-in-95 duration-200"
                )}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/30 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-indigo-500" />
                            Attendance Record
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Managing attendance for <span className="text-zinc-300 font-medium">{meeting.title}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-100 transition-colors p-1 hover:bg-zinc-800 rounded-md"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-3 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-zinc-500 font-medium uppercase">Total Records</p>
                                <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <UserIcon className="h-4 w-4 text-zinc-400" />
                            </div>
                        </div>
                        <div className="bg-emerald-950/10 border border-emerald-900/20 rounded-lg p-3 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-emerald-500/80 font-medium uppercase">Present</p>
                                <p className="text-2xl font-bold text-emerald-400">{stats.present}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-emerald-900/20 flex items-center justify-center">
                                <Check className="h-4 w-4 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* Add Attendance Section */}
                    <div className="mb-8 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Mark as Present
                            </label>
                            {selectedUserIds.length > 0 && (
                                <span className="text-xs text-indigo-400 font-medium">
                                    {selectedUserIds.length} selected
                                </span>
                            )}
                        </div>

                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden">
                            {/* Search Bar */}
                            <div className="p-2 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900/50">
                                <Search className="h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-600 w-full"
                                />
                            </div>

                            {/* User Selection List */}
                            <div className={cn(
                                "max-h-48 overflow-y-auto p-1 space-y-0.5",
                                "[&::-webkit-scrollbar]:w-1.5",
                                "[&::-webkit-scrollbar-track]:bg-transparent",
                                "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
                                "[&::-webkit-scrollbar-thumb]:rounded-full",
                                "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
                            )}>
                                {filteredUsers.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-zinc-500">No users found</div>
                                ) : (
                                    filteredUsers.map(user => {
                                        // Check if user is already marked present in the DB
                                        const isAlreadyRecorded = attendance.some(a => a.user_id === user.id && a.attended);
                                        const isSelected = selectedUserIds.includes(user.id);

                                        return (
                                            <button
                                                key={user.id}
                                                type="button"
                                                disabled={isAlreadyRecorded}
                                                onClick={() => toggleUserSelection(user.id)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left",
                                                    isAlreadyRecorded
                                                        ? "opacity-50 cursor-not-allowed bg-zinc-900/50"
                                                        : isSelected
                                                            ? "bg-indigo-500/10 hover:bg-indigo-500/20"
                                                            : "hover:bg-zinc-800/50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                                                    isAlreadyRecorded
                                                        ? "bg-emerald-500/20 border-emerald-500/50"
                                                        : isSelected
                                                            ? "bg-indigo-500 border-indigo-500"
                                                            : "border-zinc-600 bg-zinc-900"
                                                )}>
                                                    {isAlreadyRecorded && <Check className="h-3 w-3 text-emerald-500" />}
                                                    {!isAlreadyRecorded && isSelected && <Check className="h-3 w-3 text-white" />}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className={cn(
                                                        "text-sm font-medium leading-none truncate",
                                                        isSelected ? "text-indigo-200" : "text-zinc-300"
                                                    )}>
                                                        {user.username}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-500 truncate">{user.email}</span>
                                                </div>
                                                {isAlreadyRecorded && (
                                                    <span className="ml-auto text-[10px] font-medium text-emerald-500 px-1.5 py-0.5 bg-emerald-500/10 rounded">
                                                        Recorded
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={selectedUserIds.length === 0 || isSubmitting}
                            className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            <span>
                                {selectedUserIds.length > 0
                                    ? `Mark ${selectedUserIds.length} Users Present`
                                    : 'Select Users to Mark Present'}
                            </span>
                        </button>
                    </div>

                    {/* Attendance List */}
                    <div>
                        <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
                            Recorded History
                        </h4>

                        {attendance.length === 0 ? (
                            <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/20">
                                <div className="h-10 w-10 rounded-full bg-zinc-900 mx-auto flex items-center justify-center mb-3">
                                    <UserIcon className="h-5 w-5 text-zinc-600" />
                                </div>
                                <p className="text-zinc-500 text-sm">No attendance records yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {attendance.map((att) => {
                                    // Resolve user details from allUsers prop
                                    const userDetails = getUserDetails(att.user_id);
                                    const displayName = userDetails?.username || (att as any).user?.username || `User ${att.user_id}`;
                                    const displayEmail = userDetails?.email || (att as any).user?.email;

                                    return (
                                        <div
                                            key={att.id}
                                            className="group flex items-center justify-between p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 border border-zinc-700">
                                                    {displayName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-zinc-200">
                                                        {displayName}
                                                    </span>
                                                    {displayEmail && (
                                                        <span className="text-[10px] text-zinc-500">
                                                            {displayEmail}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={cn(
                                                "px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5",
                                                att.attended
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                            )}>
                                                <div className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    att.attended ? "bg-emerald-500" : "bg-red-500"
                                                )} />
                                                {att.attended ? 'Present' : 'Absent'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}