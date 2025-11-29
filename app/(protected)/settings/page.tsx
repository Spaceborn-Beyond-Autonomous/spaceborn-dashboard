"use client";

import { useState } from "react";
import { Lock, Bell, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/lib/api/users";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'security' | 'notifications'>('security');
    const [isLoading, setIsLoading] = useState(false);

    // Password Form State
    const [passForm, setPassForm] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    // Mock Notification Settings (Frontend only for now)
    const [notifSettings, setNotifSettings] = useState({
        emailAlerts: true,
        pushNotifs: false,
        securityAlerts: true
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passForm.new !== passForm.confirm) {
            toast.error("New passwords do not match");
            return;
        }

        if (passForm.new.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            await changePassword({
                current_password: passForm.current,
                new_password: passForm.new
            });
            toast.success("Password updated successfully");
            setPassForm({ current: "", new: "", confirm: "" });
        } catch (error) {
            toast.error("Failed to update password. Please check your current password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-100">Account Settings</h1>
                <p className="text-zinc-500">Manage your password, security preferences, and notifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Settings Navigation Sidebar */}
                <div className="space-y-1">
                    <button
                        onClick={() => setActiveTab('security')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all text-left",
                            activeTab === 'security'
                                ? "bg-zinc-800 text-white shadow-sm ring-1 ring-white/5"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                        )}
                    >
                        <Lock className="h-4 w-4" />
                        Security
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all text-left",
                            activeTab === 'notifications'
                                ? "bg-zinc-800 text-white shadow-sm ring-1 ring-white/5"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                        )}
                    >
                        <Bell className="h-4 w-4" />
                        Notifications
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-3">

                    {/* --- SECURITY TAB --- */}
                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                                <div className="mb-6 border-b border-zinc-800 pb-4">
                                    <h2 className="text-lg font-semibold text-zinc-100">Change Password</h2>
                                    <p className="text-sm text-zinc-500">Ensure your account is using a strong password.</p>
                                </div>

                                <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passForm.current}
                                            onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                                            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passForm.new}
                                                onChange={(e) => setPassForm({ ...passForm, new: e.target.value })}
                                                className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400">Confirm New</label>
                                            <input
                                                type="password"
                                                required
                                                value={passForm.confirm}
                                                onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                                                className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* --- NOTIFICATIONS TAB --- */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                                <div className="mb-6 border-b border-zinc-800 pb-4">
                                    <h2 className="text-lg font-semibold text-zinc-100">Notification Preferences</h2>
                                    <p className="text-sm text-zinc-500">Control how and when you receive alerts.</p>
                                </div>

                                <div className="space-y-6">
                                    {/* Email Alerts Toggle */}
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900/40 transition-colors">
                                        <div className="space-y-0.5">
                                            <h3 className="text-sm font-medium text-zinc-200">Email Alerts</h3>
                                            <p className="text-xs text-zinc-500">Receive daily summaries and critical alerts via email.</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifSettings(p => ({ ...p, emailAlerts: !p.emailAlerts }))}
                                            className={cn(
                                                "w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                                                notifSettings.emailAlerts ? "bg-indigo-600" : "bg-zinc-700"
                                            )}
                                        >
                                            <span className={cn(
                                                "absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform",
                                                notifSettings.emailAlerts ? "translate-x-5" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>

                                    {/* Push Notifications Toggle */}
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900/40 transition-colors">
                                        <div className="space-y-0.5">
                                            <h3 className="text-sm font-medium text-zinc-200">Push Notifications</h3>
                                            <p className="text-xs text-zinc-500">Receive real-time alerts on your desktop browser.</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifSettings(p => ({ ...p, pushNotifs: !p.pushNotifs }))}
                                            className={cn(
                                                "w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                                                notifSettings.pushNotifs ? "bg-indigo-600" : "bg-zinc-700"
                                            )}
                                        >
                                            <span className={cn(
                                                "absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform",
                                                notifSettings.pushNotifs ? "translate-x-5" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>

                                    {/* Security Alerts Toggle */}
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900/40 transition-colors">
                                        <div className="space-y-0.5">
                                            <h3 className="text-sm font-medium text-zinc-200">Security Alerts</h3>
                                            <p className="text-xs text-zinc-500">Get notified about new logins and password changes.</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifSettings(p => ({ ...p, securityAlerts: !p.securityAlerts }))}
                                            className={cn(
                                                "w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                                                notifSettings.securityAlerts ? "bg-indigo-600" : "bg-zinc-700"
                                            )}
                                        >
                                            <span className={cn(
                                                "absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform",
                                                notifSettings.securityAlerts ? "translate-x-5" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}