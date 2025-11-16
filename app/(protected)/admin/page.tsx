'use client';

import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
    const { user } = useAuth();
    const { users } = useData();

    if (!user || (user as any).role !== 'admin') {
        return <div>Access denied</div>;
    }

    const formattedUsers = users.map(u => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        role: u.role as 'admin' | 'core' | 'employee',
    }));

    return <AdminDashboard user={user as any} initialUsers={formattedUsers} />;
}
