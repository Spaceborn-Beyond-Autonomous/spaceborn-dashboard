import { requireRole } from '@/lib/dal';
import { listTeams } from '@/lib/api/teams';
import { listUsers } from '@/lib/api/users';

import TeamsClient from '@/components/TeamsClient';

export default async function TeamsPage() {
  // Only allow admin and core roles
  const { user } = await requireRole(['admin', 'core']);

  // Fetch teams and users data server-side
  const [teams, users] = await Promise.all([
    listTeams(),
    listUsers(),
  ]);

  return <TeamsClient initialTeams={teams} initialUsers={users} user={user} />;
}
