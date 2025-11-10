'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, FolderKanban, DollarSign, Users, CheckSquare, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <Button 
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 glass border-r border-white/10 transform transition-transform md:translate-x-0 z-40",
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            <LayoutDashboard className="h-5 w-5 text-blue-400" />
            Spaceborn
          </h2>
          <nav className="space-y-2">
            {getNavItems().map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-foreground border border-blue-500/30" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Button 
              variant="ghost"
              onClick={logout}
              className="w-full justify-start gap-3 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 mt-4"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
