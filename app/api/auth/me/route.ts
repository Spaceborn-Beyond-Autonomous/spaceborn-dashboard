import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me/`, {
        headers: { Cookie: `token=${token}` },
        credentials: 'include',
    });

    if (!res.ok) return NextResponse.json({ user: null }, { status: res.status });

    const user = await res.json();
    return NextResponse.json({ user });
}
