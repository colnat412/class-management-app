import LessonManagement from '@/containers/dashboard/lesson-management';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lesson Management',
  description: 'Manage lessons in the Class Management App',
};

const LessonManagementPage = () => {
  return <LessonManagement role="instructor" />;
};

export default LessonManagementPage;
