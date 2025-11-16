'use client'

const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000/api/v1";

export function setTokens(access: string, refresh?: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ACCESS, access);
        if (refresh) {
            localStorage.setItem(REFRESH, refresh);
        }
    }
}

export function getAccessToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(ACCESS);
    }
    return null;
}

export function getRefreshToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(REFRESH);
    }
    return null;
}

export function clearTokens() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(ACCESS);
        localStorage.removeItem(REFRESH);
    }
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

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    };

    const res = await fetch(`${BACKEND_URL}/users/login/`, requestOptions);

    const data = await res.json();
    console.log('Response data:', data);
    if (data.error) {
        throw new Error(data.error);
    }

    if (data.access_token) {
        setTokens(data.access_token);
    }

    return data;
}

export async function refreshAccessToken() {
    const refresh = getRefreshToken();
    if (!refresh) return null;

    const res = await fetch(`${BACKEND_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    });

    const data = await res.json();

    if (data.access) {
        setTokens(data.access);
    }

    return data.access || null;
}

export async function logout() {
    clearTokens();
    const response = await fetch('/api/auth/logout', {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }

    return response.json();
}
