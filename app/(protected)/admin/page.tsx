'use client';

import AdminDashboard from '@/components/AdminDashboard';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/lib/types/users';

export default function AdminPage() {
    const { user } = useAuth();

    if (!user || (user as User).role !== 'admin') {
        return <div>Access denied</div>;
    }

    return <AdminDashboard user={user} />;
}
