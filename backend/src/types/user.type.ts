export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'instructor' | 'student';
  status?: 'Active' | 'Inactive';
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lessons?: string[];
  assignedLessons?: {
    lessonId: string;
    status: 'Pending' | 'Completed';
    assignedAt: string;
  }[];
}
