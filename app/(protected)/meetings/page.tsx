import { getDashboard } from '@/lib/api/dashboard';
import { listMeetings } from '@/lib/api/meetings';
import MeetingsClient from '@/components/Meetings';

export default async function MeetingsPage() {
    const dashboard = await getDashboard();
    const meetings = await listMeetings();

    const user = {
        id: dashboard.user.id.toString(),
        name: dashboard.user.name,
        email: dashboard.user.email,
        role: dashboard.user.role,
    };

    return <MeetingsClient user={user} initialMeetings={meetings} />;
}
