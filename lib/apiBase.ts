'use client'

import { getAccessToken, setTokens } from './auth';

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
    // Since we removed refresh tokens, we'll just throw an error
    throw new Error('Token refresh not available - please log in again');
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

    // Handle 401 by throwing error (no refresh token)
    if (res.status === 401) {
        throw new Error('Authentication failed - please log in again');
    }

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
}
