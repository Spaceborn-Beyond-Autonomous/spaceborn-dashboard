import { User } from '@/lib/types/users';

interface TeamLeadProps {
    lead: User;
}

export default function TeamLead({ lead }: TeamLeadProps) {
    const initials = lead.username.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="mb-4 p-3 bg-[#1a1a1a] rounded border border-[#333]">
            <p className="text-xs text-[#aaa] mb-2">Team Lead</p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-semibold text-black">
                    {initials}
                </div>
                <span className="text-sm text-white font-medium">{lead.username}</span>
            </div>
        </div>
    );
}
