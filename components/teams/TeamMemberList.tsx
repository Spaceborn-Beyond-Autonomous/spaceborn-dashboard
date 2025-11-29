import { User } from '@/lib/types/users';
import { cn } from '@/lib/utils';
import { Shield, User as UserIcon } from 'lucide-react';

interface TeamMemberListProps {
    members: User[];
}

export default function TeamMemberList({ members }: TeamMemberListProps) {
    if (members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-zinc-800 rounded-lg bg-zinc-900/30">
                <div className="p-3 bg-zinc-900 rounded-full mb-2 opacity-50">
                    <UserIcon className="h-5 w-5 text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-500 font-medium">No members added yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center px-2 pb-2 mb-2 border-b border-zinc-800/50">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">User</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Role</span>
            </div>

            <div className={cn(
                "max-h-[300px] overflow-y-auto pr-2 space-y-1",
                // Modern Slim Scrollbar Styles
                "[&::-webkit-scrollbar]:w-1.5",
                "[&::-webkit-scrollbar-track]:bg-zinc-900/30",
                "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
            )}>
                {members.map((member) => {
                    const initials = member.username.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                    const isCore = ['admin', 'core'].includes(member.role);

                    return (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-zinc-800">
                                        {initials}
                                    </div>
                                    {/* Online indicator (mock) */}
                                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                                        {member.username}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 truncate max-w-[140px]">
                                        {member.email}
                                    </span>
                                </div>
                            </div>

                            <span className={cn(
                                "flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border",
                                isCore
                                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                            )}>
                                {isCore && <Shield className="h-2.5 w-2.5" />}
                                {member.role}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}