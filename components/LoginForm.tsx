'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Loader2, Orbit, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldLabel,
    FieldError,
    FieldGroup,
} from '@/components/ui/field';
import { login } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils'; // Assuming you have this, otherwise just join strings
import Image from 'next/image';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [generalError, setGeneralError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { refreshAuth } = useAuth();

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGeneralError('');
        setErrors({});

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const data = await login({ email, password });
            if (data.access_token) {
                refreshAuth();
                router.push('/dashboard');
            } else {
                setGeneralError('Invalid email or password');
            }
        } catch (err: any) {
            setGeneralError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 relative overflow-hidden selection:bg-indigo-500/30">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                {/* Radial Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-[100%] blur-[100px] opacity-50 animate-pulse"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Header / Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Image src="/logo.png" alt="Spaceborn Logo" width={40} height={40} />
                        <span className="text-2xl font-bold tracking-tight text-white">Spaceborn</span>
                    </div>
                    <h1 className="text-xl font-medium text-zinc-200">Welcome back</h1>
                    <p className="text-sm text-zinc-500 mt-1">Enter your credentials to access the bridge</p>
                </div>

                {/* Main Card */}
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-8 shadow-2xl shadow-black/50 ring-1 ring-white/5">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FieldGroup>
                            {/* Email Field */}
                            <Field data-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                                    Email Address
                                </FieldLabel>
                                <div className="relative group mt-2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="commander@spaceborn.io"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) setErrors({ ...errors, email: undefined });
                                        }}
                                        disabled={isLoading}
                                        className="pl-10 h-11 bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-zinc-950/80"
                                    />
                                </div>
                                {errors.email && <FieldError className="text-rose-400 text-xs mt-1.5 ml-1">{errors.email}</FieldError>}
                            </Field>

                            {/* Password Field */}
                            <Field data-invalid={!!errors.password}>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                                        Password
                                    </FieldLabel>
                                    <button
                                        type="button"
                                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                                    >
                                        Recover password?
                                    </button>
                                </div>
                                <div className="relative group mt-2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) setErrors({ ...errors, password: undefined });
                                        }}
                                        disabled={isLoading}
                                        className="pl-10 h-11 bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-zinc-950/80"
                                    />
                                </div>
                                {errors.password && <FieldError className="text-rose-400 text-xs mt-1.5 ml-1">{errors.password}</FieldError>}
                            </Field>
                        </FieldGroup>

                        {/* General Error Message */}
                        {generalError && (
                            <div className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg animate-in fade-in slide-in-from-top-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                <p className="text-sm text-rose-400 font-medium">{generalError}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                            <span className="flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </>
                                )}
                            </span>
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-zinc-600">
                        Restricted Access. Authorized Personnel Only. <br />
                        Spaceborn System v2.4.0 &copy; 2025
                    </p>
                </div>
            </div>
        </div>
    );
}