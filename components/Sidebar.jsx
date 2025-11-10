'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, FolderKanban, DollarSign, Users, CheckSquare, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const getNavItems = () => {
    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/teams', label: 'Teams', icon: Users },
      { href: '/tasks', label: 'Tasks', icon: CheckSquare }
    ];

    if (user.role === 'admin') {
      return [
        baseItems[0],
        { href: '/projects', label: 'Projects', icon: FolderKanban },
        { href: '/revenue', label: 'Revenue', icon: DollarSign },
        ...baseItems.slice(1)
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
  };

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 hover:bg-[#1a1a1a] rounded transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-[#111] border-r border-[#222] transform transition-transform md:translate-x-0 z-40",
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-8 text-white">Spaceborn</h2>
          <nav className="space-y-1">
            {getNavItems().map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 relative",
                    isActive 
                      ? "bg-white text-black before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white" 
                      : "text-[#aaa] hover:text-white hover:bg-[#1a1a1a]"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded text-[#aaa] hover:text-white hover:bg-[#1a1a1a] transition-all duration-200 mt-4"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
