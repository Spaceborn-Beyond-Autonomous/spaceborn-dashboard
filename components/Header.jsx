'use client';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Header = ({ title }) => {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="glass border-b border-white/10 px-6 py-4 sticky top-0 z-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{title}</h1>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground/90">{user.name}</p>
            <Badge variant="secondary" className="text-xs glass-card">{user.role}</Badge>
          </div>
          <Avatar className="ring-2 ring-blue-500/30">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
