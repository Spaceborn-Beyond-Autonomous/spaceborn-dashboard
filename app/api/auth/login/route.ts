import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    // Forward to Django backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
    });

    const data = await res.json();
    const response = NextResponse.json(data, { status: res.status });

    // Pass Django's Set-Cookie header to browser
    const tokenCookie = res.headers.get('set-cookie');
    if (tokenCookie) response.headers.set('set-cookie', tokenCookie);

    return response;
}
