import { requireRole } from '@/lib/dal';
import { listUsers } from '@/lib/api/users';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminPage() {
    const { user } = await requireRole(['admin']);

    const users = await listUsers();

    return <AdminDashboard user={user} initialUsers={users} />;
}
