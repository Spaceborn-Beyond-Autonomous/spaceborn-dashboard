"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { User, Mail, Shield, Save, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/lib/api/users";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { user, setUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: ""
    });

    // Populate form when user data is available
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email
            });
        }
    }, [user]);

    const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || "US";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedUser = await updateProfile(formData);

            // Update the global auth context so the Header/Sidebar update immediately
            setUser(prev => prev ? { ...prev, ...updatedUser } : null);

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Banner */}
            <div className="relative h-48 rounded-xl bg-linear-to-r from-indigo-900 to-purple-900 overflow-hidden border border-zinc-800 shadow-2xl">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 to-transparent" />

                <div className="absolute bottom-6 left-6 text-white z-10">
                    <h1 className="text-3xl font-bold tracking-tight">{user.username}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/10 border border-white/20 text-white uppercase tracking-wider flex items-center gap-1">
                            <Shield className="h-3 w-3" /> {user.role}
                        </span>
                        <span className="text-zinc-400 text-sm">{user.email}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar Card */}
                <div className="space-y-6">
                    <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex flex-col items-center text-center shadow-sm">
                        <div className="relative group cursor-pointer">
                            <div className="h-32 w-32 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-4 ring-zinc-950 group-hover:ring-zinc-800 transition-all duration-300">
                                {getInitials(user.username)}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-1">
                            <h3 className="text-lg font-medium text-zinc-100">Profile Picture</h3>
                            <p className="text-zinc-500 text-xs">Click to upload new avatar</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="md:col-span-2">
                    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm shadow-sm">
                        <div className="mb-6 pb-4 border-b border-zinc-800">
                            <h2 className="text-xl font-semibold text-zinc-100">Personal Information</h2>
                            <p className="text-sm text-zinc-500 mt-1">Update your personal details here.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-zinc-400">Username</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-zinc-400">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2 opacity-60">
                                <label className="text-sm font-medium text-zinc-400">Role (Read Only)</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        value={user.role}
                                        disabled
                                        className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-zinc-400 capitalize cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end border-t border-zinc-800 mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}