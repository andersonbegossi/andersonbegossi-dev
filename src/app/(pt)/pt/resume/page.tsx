import { ResumeScreen } from '@/components/resume-screen';
import { screenMetadata } from '@/lib/metadata';

export const metadata = screenMetadata('pt', '/resume');

export default function ResumePage() {
  return <ResumeScreen locale="pt" />;
}
