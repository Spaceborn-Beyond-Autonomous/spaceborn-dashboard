'use client'

import { getAccessToken, getRefreshToken, setTokens } from './auth';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api/v1";

function getAuthHeaders() {
    const token = getAccessToken();

    if (!token) {
        throw new Error('No access token available');
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

async function refreshAndRetry(path: string, options: any) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    // Try to refresh the token
    try {
        const refreshRes = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!refreshRes.ok) {
            throw new Error('Token refresh failed');
        }

        const { access } = await refreshRes.json();

        // Set new access token
        setTokens(access);

        // Retry original request with new token
        return fetch(`${NEXT_PUBLIC_BACKEND_URL}/${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
                ...(options.headers || {}),
            },
        });
    } catch (error) {
        throw error;
    }
}

export async function api(path: string, options: any = {}) {
    const headers = getAuthHeaders();

    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/${path}`, {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {}),
        },
    });

    // Handle 401 by refreshing token
    if (res.status === 401) {
        try {
            const retryRes = await refreshAndRetry(path, options);
            return retryRes.json();
        } catch (error) {
            throw error;
        }
    }

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
}
