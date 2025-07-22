export interface AssignLessonRequest {
  lessonId: string;
  studentIds: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}
