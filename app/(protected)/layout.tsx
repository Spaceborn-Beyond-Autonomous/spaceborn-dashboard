'use client';

import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AuthContext } from '@/context/AuthContext';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, role, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const userObj = {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        role: role as 'admin' | 'core' | 'employee',
    };

    // Determine title based on pathname
    const getTitle = (path: string) => {
        if (path === '/dashboard') return 'Dashboard';
        if (path === '/teams') return 'Teams';
        if (path === '/projects') return 'Projects';
        if (path === '/tasks') return 'Tasks';
        if (path === '/revenue') return 'Revenue';
        if (path === '/admin') return 'User Management';
        if (path === '/meetings') return 'Meetings';
        return 'Dashboard';
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar user={userObj} />
            <div className="flex-1 md:ml-64">
                <Header title={getTitle(pathname)} user={userObj} />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
