import { verifySession } from '@/lib/dal';
import { redirect } from 'next/navigation';

export default async function Page() {
  // Check if user is authenticated via DAL
  try {
    await verifySession();
    // If authenticated, redirect to dashboard
    redirect('/dashboard');
  } catch {
    // If not authenticated, redirect to login
    redirect('/login');
  }
}
