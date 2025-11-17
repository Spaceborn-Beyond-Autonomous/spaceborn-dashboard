'use client';

import { useAuth } from '@/context/AuthContext';
import MeetingsClient from '@/components/Meetings';
import { User } from '@/lib/types/users';

export default function MeetingsPage() {
    const { user } = useAuth();

    if (!user) {
        return <div>Please log in</div>;
    }

    const userFormatted = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: (user as any).role,
    } as User;

    return <MeetingsClient user={userFormatted} />;
}
