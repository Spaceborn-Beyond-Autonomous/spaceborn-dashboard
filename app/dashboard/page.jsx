import { verifySession } from '@/lib/dal';
import { getDashboard } from '@/lib/api/dashboard';
import Dashboard from '@/components/Dashboard';

export default async function DashboardPage() {
  const { user } = await verifySession();
  const dashboardData = await getDashboard();

  return <Dashboard user={user} data={dashboardData} />;
}
