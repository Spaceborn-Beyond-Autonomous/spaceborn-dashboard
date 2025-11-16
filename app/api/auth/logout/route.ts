import { NextResponse } from 'next/server';

export async function POST() {
    // Tokens are cleared client-side, this endpoint can be used for additional cleanup if needed
    return NextResponse.json({ success: true });
}
