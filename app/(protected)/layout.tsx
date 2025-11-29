'use client';

import { useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AuthContext } from '@/context/AuthContext';
import { User } from '@/lib/types/users';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

// Map specific paths to nice titles
const TITLE_MAP: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/teams': 'Teams',
    '/projects': 'Projects',
    '/tasks': 'Tasks',
    '/revenue': 'Revenue Analytics',
    '/admin': 'User Management',
    '/meetings': 'Meetings',
    '/settings': 'Settings',
};

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, role, loading } = useContext(AuthContext);

    // Redirect logic
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    // 1. Professional Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <span className="text-sm font-medium animate-pulse">Initializing Spaceborn...</span>
            </div>
        );
    }

    if (!user) return null;

    // Normalize user object
    const userObj: User = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role as 'admin' | 'core' | 'employee',
        // Add any other required fields from your User type definition
    } as User;

    // 2. Robust Title Logic
    const getTitle = (path: string) => {
        // Check exact match
        if (TITLE_MAP[path]) return TITLE_MAP[path];

        // Handle sub-routes (e.g., /projects/123 -> Projects)
        const segment = path.split('/')[1];
        if (segment) {
            const capitalized = segment.charAt(0).toUpperCase() + segment.slice(1);
            // Check if singular matches a known map (optional, mostly aesthetic)
            return capitalized;
        }

        return 'Spaceborn';
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Sidebar is fixed, so it sits "above" the layout */}
            <Sidebar user={userObj} />

            {/* Main Content Wrapper
                md:pl-64 pushes content right to accommodate fixed sidebar on desktop
            */}
            <div className="flex flex-col min-h-screen transition-all duration-300 ease-in-out md:pl-64">

                <Header title={getTitle(pathname)} user={userObj} />

                <main className="flex-1 p-6 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-2">
                        {children}
                    </div>
                </main>

            </div>

            {/* Toast Notifications */}
            <Toaster
                position="bottom-right"
                theme="dark"
                closeButton
                className="font-sans"
                toastOptions={{
                    style: {
                        background: '#18181b', // zinc-900
                        border: '1px solid #27272a', // zinc-800
                        color: '#f4f4f5', // zinc-100
                    }
                }}
            />
        </div>
    );
}