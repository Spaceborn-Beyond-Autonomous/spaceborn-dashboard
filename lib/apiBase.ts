'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000/api/v1";

async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
        redirect('/login');
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

async function refreshAndRetry(path: string, options: any) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
        redirect('/login');
    }

    // Try to refresh the token
    try {
        const refreshRes = await fetch(`${BACKEND_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!refreshRes.ok) {
            redirect('/login');
        }

        const { access } = await refreshRes.json();

        // Set new access token
        cookieStore.set('accessToken', access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60, // 1 hour
        });

        // Retry original request with new token
        return fetch(`${BACKEND_URL}/${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
                ...(options.headers || {}),
            },
        });
    } catch (error) {
        redirect('/login');
    }
}

export async function api(path: string, options: any = {}) {
    const headers = await getAuthHeaders();

    const res = await fetch(`${BACKEND_URL}/${path}`, {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {}),
        },
    });

    // Handle 401 by refreshing token
    if (res.status === 401) {
        const retryRes = await refreshAndRetry(path, options);
        if (!retryRes) redirect('/login');
        return retryRes.json();
    }

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
}
