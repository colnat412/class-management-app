export interface Lesson {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}
export interface AddLessonRequest {
  title?: string;
  description?: string;
}
