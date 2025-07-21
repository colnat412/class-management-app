export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'instructor';
  status?: 'Active' | 'Inactive';
  address?: string;
  createdAt: string;
  verified: boolean;
  lessons?: string[];
}

export interface AddStudentRequest {
  name: string;
  email: string;
  phone: string;
}
