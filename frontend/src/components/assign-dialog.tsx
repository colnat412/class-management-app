import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/types/user.interface';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';

export function AssignDialog({
  children,
  onAssign,
  title = 'Assign Lesson',
  description = 'Select students to assign this lesson to:',
}: {
  children: React.ReactNode;
  onAssign: (selectedStudentIds: string[]) => void;
  title?: string;
  description?: string;
}) {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/get-students`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const result = await res.json();
      if (res.ok) {
        setStudents(result);
      } else {
        console.error('Failed to fetch students:', result.error);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((student) => student.id));
    }
  };

  const handleAssign = () => {
    onAssign(selectedStudents);

    setSelectedStudents([]);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchStudents();
      setSelectedStudents([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No students found.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedStudents.length === students.length &&
                      students.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Select All ({students.length} students)
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  {selectedStudents.length} selected
                </div>
              </div>

              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                  >
                    <Checkbox
                      id={student.id}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentToggle(student.id)}
                    />
                    <label
                      htmlFor={student.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">
                        {student.email}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleAssign}
            disabled={selectedStudents.length === 0}
          >
            Assign to {selectedStudents.length} student
            {selectedStudents.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
