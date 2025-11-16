'use client';

import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import MeetingsClient from '@/components/Meetings';

export default function MeetingsPage() {
    const { user } = useAuth();
    const { meetings } = useData();

    if (!user) {
        return <div>Please log in</div>;
    }

    const userFormatted = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: (user as any).role,
    };

    return <MeetingsClient user={userFormatted} initialMeetings={meetings} />;
}
