'use client';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

const Header = ({ title }) => {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-[#000] border-b border-[#222] px-6 py-4 sticky top-0 z-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#1a1a1a] rounded transition-all">
            <Bell className="h-5 w-5 text-[#aaa]" />
          </button>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-[#aaa] uppercase tracking-wide">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-semibold text-sm">
            {getInitials(user.name)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
