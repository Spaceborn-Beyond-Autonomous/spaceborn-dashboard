'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md glass relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Welcome Back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/90">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-card border-white/10"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/90">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-card border-white/10"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>
            )}
            
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </form>
          
          <div className="mt-6 p-4 glass-card rounded-lg">
            <p className="text-sm font-medium mb-2 text-foreground/90">Demo Accounts:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>admin@company.com / admin123</p>
              <p>core@company.com / core123</p>
              <p>employee@company.com / emp123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
