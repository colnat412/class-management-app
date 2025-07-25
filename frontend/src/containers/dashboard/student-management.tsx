'use client';

import { ConfirmDeleteDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddStudentRequest, User } from '@/types/user.interface';
import { Edit, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const StudentManagement = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const fetchData = async () => {
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
        setData(result);
      } else {
        console.error('Failed to fetch students:', result.error);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async () => {
    setIsSaving(true);
    try {
      const body: AddStudentRequest = {
        name,
        email,
        phone,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/add-student`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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
            status: 'Inactive',
            role: 'student',
            createdAt: new Date().toISOString(),
            verified: false,
          } as User,
        ]);
        fetchData();
        handleCloseDialog();
      } else {
        console.error('Failed to add student:', result.error);
        toast.error(result.error || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('An unexpected error occurred while adding student');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStudent = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const body = {
        id: user.id,
        name,
        email,
        phone,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/update-student`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(body),
        }
      );
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || 'Student updated successfully');
        setData((prev) =>
          prev.map((student) =>
            student.id === user.id
              ? { ...student, name, email, phone }
              : student
          )
        );
        handleCloseDialog();
      } else {
        console.error('Failed to update student:', result.error);
        toast.error(result.error || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('An unexpected error occurred while updating student');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleUpdateStudent();
    } else {
      handleAddStudent();
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/delete-student`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ id }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || 'Student deleted successfully');
        setData((prev) => prev.filter((student) => student.id !== id));
      } else {
        console.error('Failed to delete student:', result.error);
        toast.error(result.error || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('An unexpected error occurred while deleting student');
    }
  };

  const handleEditStudent = (student: User) => {
    setUser(student);
    setName(student.name);
    setEmail(student.email);
    setPhone(student.phone || '');
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleOpenAddStudentDialog = () => {
    setUser(null);
    setName('');
    setEmail('');
    setPhone('');
    setIsEditing(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setUser(null);
    setName('');
    setEmail('');
    setPhone('');
    setIsEditing(false);
    setIsSaving(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const SkeletonRow = () => (
    <TableRow>
      <TableCell className="font-medium">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="text-gray-600">
        <Skeleton className="h-4 w-48" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16 rounded-full" />
      </TableCell>
      <TableCell width={50} className="flex justify-start items-center gap-2">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-16" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="flex flex-col gap-4 h-full w-full p-6">
      <h1 className=" text-2xl">Manage Students</h1>
      <div className="flex items-center justify-between w-full">
        {isLoading ? (
          <Skeleton className="h-7 w-28" />
        ) : (
          <h2 className="text-lg font-medium text-gray-900">
            {data.length} Students
          </h2>
        )}
        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white"
                onClick={handleOpenAddStudentDialog}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-10 sm:max-w-4xl w-5/6">
              <DialogHeader>
                <DialogTitle className="flex justify-center items-center text-2xl">
                  {user ? 'Edit Student' : 'Create Student'}
                </DialogTitle>
              </DialogHeader>
              <form className="flex flex-col gap-6">
                <div className="flex flex-row gap-4 w-full">
                  <div className="flex flex-col gap-4 w-full">
                    <Label htmlFor="name-1">Student Name</Label>
                    <Input
                      className="p-6"
                      id="name-1"
                      placeholder="Student Name"
                      value={name}
                      onChange={(event) => handleChangeInput(event, setName)}
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Label htmlFor="email-1">Email Address</Label>
                    <Input
                      className="p-6"
                      id="email-1"
                      placeholder="Email Address"
                      value={email}
                      onChange={(event) => handleChangeInput(event, setEmail)}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-4 w-full">
                  <div className="flex flex-col gap-4 w-full">
                    <Label htmlFor="phone-1">Phone Number</Label>
                    <Input
                      className="p-6"
                      id="phone-1"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(event) => handleChangeInput(event, setPhone)}
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Label htmlFor="role-1">Role</Label>
                    <Select defaultValue="student" disabled>
                      <SelectTrigger className="w-full p-6">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="instructor">Instructor</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <Label htmlFor="address-1">Address</Label>
                  <Input className="p-6" id="address-1" placeholder="Address" />
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

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Filter"
              className="pl-10"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-lg border w-full overflow-auto min-h-0">
        <Table className="h-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium text-gray-900">
                Student Name
              </TableHead>
              <TableHead className="font-medium text-gray-900">Email</TableHead>
              <TableHead className="font-medium text-gray-900">
                Status
              </TableHead>
              <TableHead className="font-medium text-gray-900">
                Action
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
                <TableCell colSpan={4} className="text-center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {student.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${
                        student.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    width={50}
                    className="flex justify-start items-center gap-2"
                  >
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleEditStudent(student)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <ConfirmDeleteDialog
                      onConfirm={() => handleDeleteStudent(student.id)}
                      title="Delete Student"
                      description="Are you sure you want to delete this student? This action cannot be undone."
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

export default StudentManagement;
