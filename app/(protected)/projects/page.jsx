'use client';

import { useState, useEffect } from 'react';
import { getDashboard } from '@/lib/api/dashboard';
import { getProjects } from '@/lib/api/projects';
import ProjectsClient from '@/components/Projects';

export default function ProjectsPage() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getDashboard().then((data) => {
      setUser({
        id: data.user.id.toString(),
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });
    });
    getProjects().then(setProjects);
  }, []);

  if (!user) return null;

  return <ProjectsClient user={user} initialProjects={projects} />;
}
