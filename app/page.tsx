// app/page.tsx (server component)
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth'; // server-side auth checker

export default async function Home() {
  const user = await getCurrentUser(); // runs on server

  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }

  // this component never renders
  return null;
}
