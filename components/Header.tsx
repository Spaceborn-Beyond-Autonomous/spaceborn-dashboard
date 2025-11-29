'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types/users';
import { Bell, Search, Calendar, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  user: User;
}

const Header = ({ title, user }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true); // Mock state

  // Handle scroll effect for glassmorphism border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-20 w-full px-6 py-4 transition-all duration-200",
        "bg-zinc-950/80 backdrop-blur-md", // Glass effect
        isScrolled ? "border-b border-zinc-800" : "border-b border-transparent"
      )}
    >
      <div className="flex justify-between items-center gap-4">

        {/* Left Section: Title & Date */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            {title}
          </h1>
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 mt-1">
            <Calendar className="h-3 w-3" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* Search Bar (Hidden on small mobile) */}
          <div className="hidden md:flex items-center relative group">
            <Search className="absolute left-3 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-64 rounded-full bg-zinc-900/50 border border-zinc-800 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Notification Bell */}
            <button
              className="relative p-2.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
              onClick={() => setHasNotifications(false)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {hasNotifications && (
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-zinc-950 animate-pulse" />
              )}
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

            {/* User Profile (Simplified for Header) */}
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-zinc-200 leading-none">{user.username}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{user.role}</p>
              </div>

              <button className="relative group">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20 ring-2 ring-zinc-950 group-hover:ring-zinc-800 transition-all">
                  {getInitials(user.username)}
                </div>
                {/* Online Status Indicator */}
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;