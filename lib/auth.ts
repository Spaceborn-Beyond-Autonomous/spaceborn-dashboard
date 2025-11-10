export interface JWTPayload {
    id: string;
    email: string;
}

export async function login(email: string, password: string): Promise<boolean> {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // store HttpOnly cookie
    });

    return res.ok;
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
    const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
    });

    if (!res.ok) return null;

    const { user } = await res.json();
    return user as JWTPayload;
}

export async function logout(): Promise<boolean> {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
    });

    return res.ok;
}
