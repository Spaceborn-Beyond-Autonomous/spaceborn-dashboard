'use server'

import { cookies } from 'next/headers';

const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000/api/v1";

export async function setTokens(access: string, refresh?: string) {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS, access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
    });

    if (refresh) {
        cookieStore.set(REFRESH, refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
    }
}

export async function getAccessToken() {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS)?.value;
}

export async function getRefreshToken() {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH)?.value;
}

export async function clearTokens() {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS);
    cookieStore.delete(REFRESH);
}

export async function login(credentials: { email: string; password: string }) {
    const { email, password } = credentials;

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const payload = {
        email,
        password
    };

    console.log('Payload being sent:', payload);
    console.log('Stringified payload:', JSON.stringify(payload));

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    };

    console.log('Request options:', requestOptions);

    const res = await fetch(`${BACKEND_URL}/auth/login/`, requestOptions);

    const data = await res.json();
    console.log('Response status:', res.status);
    console.log('Response data:', data);

    if (data.access) {
        await setTokens(data.access, data.refresh);
    }

    return data;
}

export async function refreshAccessToken() {
    const refresh = await getRefreshToken();
    if (!refresh) return null;

    const res = await fetch(`${BACKEND_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    });

    const data = await res.json();

    if (data.access) {
        await setTokens(data.access);
    }

    return data.access || null;
}

export async function logout() {
    const response = await fetch('/api/auth/logout', {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }

    return response.json();
}
