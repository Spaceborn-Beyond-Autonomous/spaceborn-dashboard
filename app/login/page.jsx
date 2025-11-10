'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#000]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Welcome Back</h1>
          <p className="text-sm text-[#aaa]">Enter your credentials to access your dashboard</p>
        </div>
        
        <div className="bg-[#111] border border-[#222] rounded p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-white">Email</label>
              <input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#000] text-white border border-[#222] rounded focus:border-white outline-none transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-white">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#000] text-white border border-[#222] rounded focus:border-white outline-none transition-all"
                required
              />
            </div>
            
            {error && (
              <div className="text-sm text-white bg-[#222] p-3 rounded border border-[#333]">{error}</div>
            )}
            
            <button type="submit" className="w-full bg-white text-black px-4 py-2 rounded hover:bg-[#aaa] transition-all duration-200 flex items-center justify-center gap-2 font-medium">
              <LogIn className="h-4 w-4" />
              Login
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-[#222]">
            <p className="text-sm font-medium mb-2 text-white">Demo Accounts:</p>
            <div className="text-xs space-y-1 text-[#aaa]">
              <p>admin@company.com / admin123</p>
              <p>core@company.com / core123</p>
              <p>employee@company.com / emp123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
