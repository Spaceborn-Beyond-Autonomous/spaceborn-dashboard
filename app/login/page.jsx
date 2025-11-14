import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default async function LoginPage() {
  // Check if user is already authenticated
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  // Redirect to dashboard if already logged in
  if (token) {
    redirect('/dashboard');
  }

  // Render login form for unauthenticated users
  return <LoginForm />;
}
