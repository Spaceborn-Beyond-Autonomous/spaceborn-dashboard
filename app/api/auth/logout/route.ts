import { NextResponse } from 'next/server';

export async function POST() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout/`, {
        method: 'POST',
        credentials: 'include',
    });

    const response = NextResponse.json({ success: res.ok });
    response.cookies.delete('token'); // Delete the token cookie

    return response;
}
