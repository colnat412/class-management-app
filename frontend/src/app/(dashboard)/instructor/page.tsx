import StudentManagement from '@/containers/dashboard/student-management';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Class Management App | Instructor',
  description: 'Manage students in the Class Management App',
};

const StudentManagementPage = () => {
  return <StudentManagement />;
};

export default StudentManagementPage;
