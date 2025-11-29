'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types/users';
import {
  Bell, Search, Calendar, Check, Trash2, Info,
  CheckCircle2, AlertTriangle, XCircle, LogOut,
  User as UserIcon, Settings, ChevronDown, CreditCard
} from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';
import {
  listNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '@/lib/api/notifications';
import { Notification } from '@/lib/types/notifications';
import { toast } from 'sonner';

interface HeaderProps {
  title: string;
  user: User;
}

const Header = ({ title, user }: HeaderProps) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  // Refs for click-outside logic
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // --- 1. Data Fetching ---
  const loadNotifications = async () => {
    try {
      const data = await listNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);

    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);

    // Unified Click Outside Handler
    const handleClickOutside = (event: MouseEvent) => {
      // Close Notifications if clicked outside
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      // Close Profile if clicked outside
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- 2. Notification Actions ---
  const handleMarkRead = async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    try {
      await markNotificationAsRead(id);
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    try {
      await markAllNotificationsAsRead();
      toast.success("All marked as read");
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await deleteNotification(id);
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  // --- 3. Profile Actions ---
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Helpers
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <header className={cn(
      "sticky top-0 z-20 w-full px-6 py-4 transition-all duration-200",
      "bg-zinc-950/80 backdrop-blur-md",
      isScrolled ? "border-b border-zinc-800" : "border-b border-transparent"
    )}>
      <div className="flex justify-between items-center gap-4">

        {/* Title Section */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">{title}</h1>
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 mt-1">
            <Calendar className="h-3 w-3" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* Search (Visual Only) */}
          <div className="hidden md:flex items-center relative group">
            <Search className="absolute left-3 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <input type="text" placeholder="Search..." className="h-10 w-64 rounded-full bg-zinc-900/50 border border-zinc-800 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all" />
          </div>

          <div className="flex items-center gap-2 md:gap-3">

            {/* --- Notifications Dropdown --- */}
            <div className="relative" ref={notifRef}>
              <button
                className={cn(
                  "relative p-2.5 rounded-full transition-all duration-200",
                  isNotifOpen ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                )}
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-zinc-950 animate-pulse" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
                    <h3 className="font-semibold text-sm text-zinc-100">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                        <Check className="h-3 w-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {isLoading ? (
                      <div className="p-8 text-center text-zinc-500 text-xs">Loading...</div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleMarkRead(notif.id)}
                          className={cn(
                            "p-4 border-b border-zinc-800/50 cursor-pointer transition-colors group relative",
                            notif.is_read ? "bg-zinc-950 hover:bg-zinc-900/50" : "bg-zinc-900/20 hover:bg-zinc-900"
                          )}
                        >
                          <div className="flex gap-3">
                            <div className="mt-1 p-1.5 rounded-full bg-zinc-900 border border-zinc-800 shrink-0 h-fit">
                              {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-start">
                                <p className={cn("text-sm font-medium", notif.is_read ? "text-zinc-400" : "text-zinc-100")}>
                                  {notif.title}
                                </p>
                                <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-2">
                                  {formatTimeAgo(notif.created_at)}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDelete(e, notif.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {!notif.is_read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-500" />}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-zinc-500 flex flex-col items-center">
                        <div className="p-3 bg-zinc-900 rounded-full mb-3"><Bell className="h-5 w-5 opacity-20" /></div>
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

            {/* --- User Profile Dropdown --- */}
            <div className="relative pl-2" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-zinc-200 leading-none group-hover:text-white transition-colors">
                    {user.username}
                  </p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
                    {user.role}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20 ring-2 ring-zinc-950 group-hover:ring-zinc-800 transition-all">
                  {getInitials(user.username)}
                </div>
                <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-200 hidden sm:block", isProfileOpen && "rotate-180")} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">

                  {/* Dropdown Header Info */}
                  <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/30">
                    <p className="text-sm font-medium text-white truncate">{user.username}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1 space-y-0.5">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>

                    {/* <Link
                      href="/billing"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Billing</span>
                    </Link> */}
                  </div>

                  {/* Footer / Logout */}
                  <div className="p-1 border-t border-zinc-800 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;