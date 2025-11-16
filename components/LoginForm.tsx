'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
} from '@/components/ui/field';
import { login } from '@/lib/auth';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [generalError, setGeneralError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

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
            const data = await login(email, password);

            if (data.access) {
                router.push('/dashboard');
                router.refresh();
            } else {
                setGeneralError(data.error || 'Invalid email or password');
            }
        } catch (err) {
            setGeneralError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-black via-[#0a0a0a] to-[#111] relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-sm text-white/60">Sign in to continue to your dashboard</p>
                </div>

                {/* Glassmorphism Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FieldGroup>
                            {/* Email Field */}
                            <Field data-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email" className="text-white/90">
                                    Email Address
                                </FieldLabel>
                                <div className="relative group mt-2">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors z-10" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) setErrors({ ...errors, email: undefined });
                                        }}
                                        aria-invalid={!!errors.email}
                                        disabled={isLoading}
                                        className="pl-12 bg-white/5 text-white placeholder-white/40 border-white/10 focus:ring-white/30 focus:border-transparent disabled:opacity-50"
                                    />
                                </div>
                                {errors.email && <FieldError className="text-red-400 mt-1.5">{errors.email}</FieldError>}
                            </Field>

                            {/* Password Field */}
                            <Field data-invalid={!!errors.password}>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password" className="text-white/90">
                                        Password
                                    </FieldLabel>
                                    <button
                                        type="button"
                                        className="text-xs text-white/60 hover:text-white transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative group mt-2">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors z-10" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) setErrors({ ...errors, password: undefined });
                                        }}
                                        aria-invalid={!!errors.password}
                                        disabled={isLoading}
                                        className="pl-12 bg-white/5 text-white placeholder-white/40 border-white/10 focus:ring-white/30 focus:border-transparent disabled:opacity-50"
                                    />
                                </div>
                                {errors.password && <FieldError className="text-red-400 mt-1.5">{errors.password}</FieldError>}
                            </Field>
                        </FieldGroup>

                        {/* General Error Message */}
                        {generalError && (
                            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-in slide-in-from-top-2">
                                <div className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                </div>
                                <p className="text-sm text-red-400 flex-1">{generalError}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white hover:bg-white/90 text-black font-semibold h-12 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-5 w-5 mr-2" />
                                    Sign In
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-white/40">
                <p>
                    Secured by Spaceborn &copy; 2025
                </p>
            </div>
        </div>
    );
}
