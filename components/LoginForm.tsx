'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                setError(data.error || 'Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
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
                                className="w-full px-3 py-2 bg-black text-white border border-[#222] rounded focus:border-white outline-none transition-all"
                                required
                                disabled={isLoading}
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
                                className="w-full px-3 py-2 bg-black text-white border border-[#222] rounded focus:border-white outline-none transition-all"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black px-4 py-2 rounded hover:bg-[#aaa] transition-all duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogIn className="h-4 w-4" />
                            {isLoading ? 'Logging in...' : 'Login'}
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
