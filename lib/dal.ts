'use client'

import { getAccessToken } from './auth';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api/v1";

export type UserRole = 'admin' | 'core' | 'employee';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export async function verifySession() {
    const token = getAccessToken();

    if (!token) {
        throw new Error('No access token');
    }

    try {
        const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/verify/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Invalid token');
        }

        const user: User = await response.json();
        return { user };
    } catch (error) {
        throw error;
    }
}

// Helper function to check if user has required role
export async function requireRole(allowedRoles: UserRole[]) {
    const { user } = await verifySession();

    if (!allowedRoles.includes(user.role)) {
        throw new Error('Unauthorized');
    }

    return { user };
}
