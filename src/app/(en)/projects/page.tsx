import { ProjectsScreen } from '@/components/projects-screen';
import { screenMetadata } from '@/lib/metadata';

export const metadata = screenMetadata('en', '/projects');

export default function ProjectsPage() {
  return <ProjectsScreen locale="en" />;
}
