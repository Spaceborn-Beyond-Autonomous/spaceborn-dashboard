'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash2, X } from 'lucide-react';
import { getAccessToken } from '@/lib/auth';
import { User } from '@/lib/types/users';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api/v1";

interface AdminDashboardProps {
    user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'employee' as 'admin' | 'core' | 'employee',
    });

    // Fetch users from backend
    const fetchUsers = async () => {
        const token = getAccessToken();
        if (!token) {
            console.error('No access token');
            return;
        }
        try {
            const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/users/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data: User[] = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                password: '',
                role: user.role as 'admin' | 'core' | 'employee',
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'employee',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ username: '', email: '', password: '', role: 'employee' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getAccessToken();
        if (!token) {
            console.error('No access token');
            return;
        }
        try {
            let response;
            if (editingUser) {
                // Update user
                response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/users/${editingUser.id}/`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
            } else {
                // Create user
                response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/users/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
            }
            if (!response.ok) throw new Error('Failed to save user');

            await fetchUsers(); // Refresh users list
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        const token = getAccessToken();
        if (!token) {
            console.error('No access token');
            return;
        }
        try {
            const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/users/${userId}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to delete user');

            await fetchUsers(); // Refresh users list
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-500/20 text-red-400';
            case 'core':
                return 'bg-blue-500/20 text-blue-400';
            default:
                return 'bg-green-500/20 text-green-400';
        }
    };

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">User Management</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-all"
                >
                    <UserPlus className="h-4 w-4" />
                    Add User
                </button>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#1a1a1a]">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[#aaa]">Name</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[#aaa]">Email</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[#aaa]">Role</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[#aaa]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t border-[#222] hover:bg-[#1a1a1a] transition-all">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black text-xs font-semibold">
                                            {u.username
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </div>
                                        <span className="text-white">{u.username}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#aaa]">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded text-xs font-medium uppercase ${getRoleBadgeColor(
                                            u.role,
                                        )}`}
                                    >
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(u)}
                                            className="p-2 hover:bg-[#222] rounded transition-all"
                                        >
                                            <Edit className="h-4 w-4 text-[#aaa] hover:text-white" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="p-2 hover:bg-[#222] rounded transition-all"
                                            disabled={u.id === user.id}
                                        >
                                            <Trash2 className="h-4 w-4 text-[#aaa] hover:text-red-400" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#111] border border-[#222] rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h3>
                            <button onClick={handleCloseModal}>
                                <X className="h-5 w-5 text-[#aaa] hover:text-white" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({ ...formData, username: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                    required
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-[#aaa] mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                        required={!editingUser}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[#aaa] mb-2">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({ ...formData, role: e.target.value as any })
                                    }
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded text-white focus:outline-none focus:border-white"
                                >
                                    <option value="employee">Employee</option>
                                    <option value="core">Core</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-all"
                                >
                                    {editingUser ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#222] transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
