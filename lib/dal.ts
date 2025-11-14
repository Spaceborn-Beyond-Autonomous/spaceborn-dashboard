'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000/api/v1";

// Cache prevents multiple calls during a single request
export const verifySession = cache(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
        redirect('/login');
    }

    // Verify token is valid with backend
    try {
        const response = await fetch(`${BACKEND_URL}/auth/verify/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Invalid token');
        }

        const user = await response.json();
        return { user, token };
    } catch (error) {
        redirect('/login');
    }
});
