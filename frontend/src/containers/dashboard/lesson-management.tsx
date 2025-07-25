'use client';

import { AssignDialog } from '@/components/assign-dialog';
import { ConfirmDeleteDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  AddLessonRequest,
  Lesson,
  LessonResponse,
} from '@/types/lesson.interface';
import {
  BookUp,
  Edit,
  Loader2,
  Plus,
  Search,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface LessonManagementProps {
  role: 'instructor' | 'student';
}

const LessonManagement = ({ role }: LessonManagementProps) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [data, setData] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Changed to false initially
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const handleChangeTextarea = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lesson/get-lessons`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const result = await res.json();

      if (res.ok) {
        setData(result);
      } else {
        console.error('Failed to fetch lessons:', result.error);
        toast.error('Failed to fetch lessons');
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Error fetching lessons');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataStudents = async () => {
    setIsLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
      if (!userId) {
        console.error('No user ID found');
        toast.error('User not found');
        setIsLoading(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lesson/get-assigned-lessons/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const result = await res.json();

      if (res.ok) {
        setData(result.map((item: LessonResponse) => item.lessonDetails));
      } else {
        console.error('Failed to fetch assigned lessons:', result.error);
        toast.error('Failed to fetch assigned lessons');
      }
    } catch (error) {
      console.error('Error fetching assigned lessons:', error);
      toast.error('Error fetching assigned lessons');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLesson = async () => {
    setIsSaving(true);
    try {
      const body: AddLessonRequest = {
        title,
        description,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lesson/add-lesson`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || 'Student added successfully');
        setData((prev) => [
          ...prev,
          {
            ...body,
            id: result.id,
            createdAt: new Date().toISOString(),
          } as Lesson,
        ]);

        handleCloseDialog();
      } else {
        console.error('Failed to add lesson:', result.error);
        toast.error(result.error || 'Failed to add lesson');
      }
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('An unexpected error occurred while adding lesson');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateLesson = async () => {
    if (!lesson) return;

    setIsSaving(true);
    try {
      const body = {
        id: lesson.id,
        title,
        description,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lesson/update-lesson`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || 'Lesson updated successfully');
        setData((prev) =>
          prev.map((item) =>
            item.id === lesson.id ? { ...item, title, description } : item
          )
        );
        handleCloseDialog();
      } else {
        console.error('Failed to update lesson:', result.error);
        toast.error(result.error || 'Failed to update lesson');
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('An unexpected error occurred while updating lesson');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lesson/delete-lesson`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || 'Lesson deleted successfully');
        setData((prev) => prev.filter((lesson) => lesson.id !== id));
      } else {
        console.error('Failed to delete lesson:', result.error);
        toast.error(result.error || 'Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('An unexpected error occurred while deleting lesson');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setLesson(null);
    setTitle('');
    setDescription('');
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setLesson(lesson);
    setTitle(lesson.title);
    setDescription(lesson.description);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenAddLessonDialog = () => {
    setLesson(null);
    setTitle('');
    setDescription('');
    setIsEditing(false);
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleUpdateLesson();
    } else {
      handleAddLesson();
    }
  };

  const handleAssignLessonToStudent = async (
    lessonId: string,
    studentIds: string[]
  ) => {
    setIsSaving(true);
    try {
      const body = {
        lessonId,
        studentIds,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lesson/assign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || 'Lesson assigned successfully');
      } else {
        console.error('Failed to assign lesson:', result.error);
        toast.error(result.error || 'Failed to assign lesson');
      }
    } catch (error) {
      console.error('Error assigning lesson:', error);
      toast.error('An unexpected error occurred while assigning lesson');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkLessonDone = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (role === 'instructor') {
      fetchData();
    } else {
      fetchDataStudents();
    }
  }, [role]);

  const SkeletonRow = () => (
    <TableRow className="w-full">
      <TableCell className="font-medium max-w-26 w-full">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="text-gray-600 max-w-40 truncate">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell
        width={50}
        className="flex justify-start items-center gap-2 max-w-12"
      >
        <Skeleton className="h-8 w-12" />
        {role === 'instructor' && (
          <>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="flex flex-col gap-4 w-full p-6">
      <h1 className=" text-2xl">
        {role === 'instructor' ? 'Manage Lessons' : 'View Lessons'}
      </h1>
      <div className="flex items-center justify-between w-full">
        {isLoading ? (
          <Skeleton className="h-7 w-28" />
        ) : (
          <h2 className="text-lg font-medium text-gray-900">
            {data.length} Lesson{data.length !== 1 ? 's' : ''}
          </h2>
        )}
        <div className="flex items-center gap-3">
          {role === 'instructor' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white"
                  onClick={handleOpenAddLessonDialog}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-10 sm:max-w-4xl w-5/6">
                <DialogHeader>
                  <DialogTitle className="flex justify-center items-center text-2xl">
                    {lesson ? 'Edit Lesson' : 'Create Lesson'}
                  </DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-4 w-full">
                      <Label htmlFor="name-1">Title</Label>
                      <Input
                        className="py-6"
                        id="title-1"
                        placeholder="Lesson Title"
                        value={title}
                        onChange={(event) => handleChangeInput(event, setTitle)}
                      />
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                      <Label htmlFor="email-1">Description</Label>
                      <Textarea
                        className="py-6"
                        id="description-1"
                        placeholder="Description of the lesson"
                        value={description}
                        onChange={(event) =>
                          handleChangeTextarea(event, setDescription)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      className="bg-blue-600 text-white hover:bg-blue-700 w-1/5 py-6 text-md hover:cursor-pointer"
                      onClick={handleSubmit}
                      disabled={isSaving}
                    >
                      {isSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isSaving ? '' : 'Save'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Filter" className="pl-10 w-40" />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-lg border w-full overflow-auto min-h-0">
        <Table className="h-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium text-gray-900">Title</TableHead>
              <TableHead className="font-medium text-gray-900">
                Description
              </TableHead>
              <TableHead className="font-medium text-gray-900">
                {role === 'instructor' ? 'Actions' : 'Mark as Done'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No lessons found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((lesson) => (
                <TableRow key={lesson.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium max-w-32">
                    {lesson.title}
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-40 truncate">
                    {lesson.description}
                  </TableCell>
                  <TableCell className="flex justify-start items-center gap-2 max-w-3">
                    {role === 'instructor' ? (
                      <>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleEditLesson(lesson)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <AssignDialog
                          onAssign={(selectedStudentIds) => {
                            handleAssignLessonToStudent(
                              lesson.id,
                              selectedStudentIds
                            );
                          }}
                          title={`Assign "${lesson.title}"`}
                          description="Select students to assign this lesson to:"
                        >
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                          >
                            <BookUp className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        </AssignDialog>
                        <ConfirmDeleteDialog
                          onConfirm={() => handleDeleteLesson(lesson.id)}
                          title="Delete Lesson"
                          description="Are you sure you want to delete this lesson? This action cannot be undone."
                        >
                          <Button
                            size="sm"
                            variant="destructive"
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </ConfirmDeleteDialog>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className={
                          completedLessons.has(lesson.id)
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                        }
                        onClick={() => handleMarkLessonDone(lesson.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {completedLessons.has(lesson.id) ? 'Done' : 'Mark Done'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LessonManagement;
