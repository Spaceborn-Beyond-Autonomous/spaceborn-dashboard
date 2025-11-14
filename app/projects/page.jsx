import { requireRole } from '@/lib/dal';
import { getProjects } from '@/lib/api/projects';
import ProjectsClient from '@/components/Projects';

export default async function ProjectsPage() {
  // Only allow admin and core roles
  const { user } = await requireRole(['admin', 'core']);

  // Fetch projects data server-side
  const projects = await getProjects();

  return <ProjectsClient user={user} initialProjects={projects} />;
}
