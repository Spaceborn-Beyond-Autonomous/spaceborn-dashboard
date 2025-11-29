'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  DollarSign,
  Users,
  CheckSquare,
  LogOut,
  Menu,
  X,
  UserCog,
  Presentation,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/lib/types/users';
import Image from 'next/image';

interface SidebarProps {
  user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  // Memoize nav items to prevent recalculation on every render
  const navItems = useMemo(() => {
    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/teams', label: 'Teams', icon: Users },
      { href: '/tasks', label: 'Tasks', icon: CheckSquare },
      { href: '/meetings', label: 'Meetings', icon: Presentation }
    ];

    if (user.role === 'admin') {
      return [
        baseItems[0],
        { href: '/projects', label: 'Projects', icon: FolderKanban },
        { href: '/revenue', label: 'Revenue', icon: DollarSign },
        ...baseItems.slice(1),
        { href: '/admin', label: 'User Management', icon: UserCog },
      ];
    }

    if (user.role === 'core') {
      return [
        baseItems[0],
        { href: '/projects', label: 'Projects', icon: FolderKanban },
        ...baseItems.slice(1)
      ];
    }

    return baseItems;
  }, [user.role]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        aria-label="Toggle Menu"
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-zinc-900 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 shadow-xl transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col z-40 transition-transform duration-300 ease-in-out",
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>

        {/* 1. Header / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
              <Image src="/logo.png" alt="Spaceborn Logo" width={24} height={24} className="h-6 w-6 text-indigo-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-100">Spaceborn</span>
          </Link>
        </div>

        {/* 2. Navigation Area */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Platform
            </p>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-zinc-800/60 text-white shadow-sm ring-1 ring-white/5"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-indigo-500 rounded-r-full" />
                )}
                <Icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
                )} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. User Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl transition-colors hover:bg-zinc-800/50 group">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar Generator */}
              <div className="h-9 w-9 shrink-0 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/20 ring-2 ring-zinc-900">
                {user.username.substring(0, 2).toUpperCase()}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                  {user.username}
                </span>
                <span className="text-xs text-zinc-500 capitalize truncate">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Sign Out"
              className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <LogOut className={cn("h-4 w-4", isLoggingOut && "animate-pulse")} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}