'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api/users';
import { listTeams } from '@/lib/api/teams';
import { listUsers } from '@/lib/api/users';
import TeamsClient from '@/components/Teams';

export default function TeamsPage() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUser();
        if (!['admin', 'core'].includes(userData.role)) {
          router.push('/dashboard');
          return;
        }
        setUser(userData);
        const [teamsData, usersData] = await Promise.all([
          listTeams(),
          listUsers(),
        ]);
        setTeams(teamsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/login');
      }
    };

    fetchData();
  }, [router]);

  if (!user) return null;

  return <TeamsClient initialTeams={teams} initialUsers={users} user={user} />;
}
