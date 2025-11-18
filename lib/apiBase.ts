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

    // Handle 401 or 403 by throwing error (no refresh token)
    if (res.status === 401 || res.status === 403) {
        throw new Error('Authentication failed - please log in again');
    }

    if (res.status === 404) {
        throw new Error('Resource not found');
    }

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    // If status code 204 (No Content), do not parse JSON
    if (res.status === 204) {
        return;  // Return undefined/void
    }

    return res.json();
}
