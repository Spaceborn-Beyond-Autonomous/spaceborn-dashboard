import { User } from '@/lib/types/users';

interface TeamMemberListProps {
    members: User[];
}

export default function TeamMemberList({ members }: TeamMemberListProps) {
    if (members.length === 0) {
        return (
            <div className="py-4">
                <p className="text-sm text-[#aaa] text-center">No members yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {members.map((member) => {
                const initials = member.username.split(' ').map(n => n[0]).join('').toUpperCase();

                return (
                    <div
                        key={member.id}
                        className="flex items-center justify-between py-2 border-b border-[#222] last:border-0"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-xs font-medium text-white">
                                {initials}
                            </div>
                            <span className="text-sm text-white">{member.username}</span>
                        </div>
                        <span className="text-xs bg-[#222] text-white px-2 py-1 rounded uppercase tracking-wide">
                            {member.role}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
