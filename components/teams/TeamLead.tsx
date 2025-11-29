import { User } from '@/lib/types/users';
import { Crown } from 'lucide-react';

interface TeamLeadProps {
    lead: User;
}

export default function TeamLead({ lead }: TeamLeadProps) {
    const initials = lead.username.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Team Lead</label>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
                <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-zinc-900">
                        {initials}
                    </div>
                    <div className="absolute -top-1 -right-1 bg-zinc-900 rounded-full p-0.5">
                        <Crown className="h-3 w-3 text-amber-400 fill-amber-400" />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-zinc-200">{lead.username}</p>
                    <p className="text-[10px] text-zinc-500">{lead.email}</p>
                </div>
            </div>
        </div>
    );
}