'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AddStudentRequest, User } from '@/types/user.interface';
import { toast } from 'sonner';

const StudentManagement = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [data, setData] = useState<User[]>([]);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const fetchData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/student/get-students`,
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
      console.error('Failed to fetch students:', result.error);
    }
  };

  const handleAddStudent = async () => {
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
        },
        body: JSON.stringify(body),
      }
    );
    const result = await res.json();
    console.log('Response from add student:', result);

    if (res.ok) {
      toast.success(result.message || 'Student added successfully');
      setName('');
      setEmail('');
      setPhone('');
      setData((prev) => [...prev, result]);
    } else {
      console.error('Failed to add student:', result.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [data.length]);

  return (
    <div className="flex flex-col gap-4 h-full w-full p-6">
      <h1 className=" text-2xl">Manage Students</h1>
      <div className="flex items-center justify-between ">
        <h2 className="text-lg font-medium text-gray-900">
          {data.length} Students
        </h2>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col gap-10 sm:max-w-4xl w-5/6">
              <DialogHeader>
                <DialogTitle className="flex justify-center items-center text-2xl">
                  Create Student
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
                      onChange={(event) => handleChangeInput(event, setName)}
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Label htmlFor="email-1">Email Address</Label>
                    <Input
                      className="p-6"
                      id="email-1"
                      placeholder="Email Address"
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
                      onChange={(event) => handleChangeInput(event, setPhone)}
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Label htmlFor="role-1">Role</Label>
                    <Select>
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
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 w-1/5 py-6 text-md"
                    onClick={handleAddStudent}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

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
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
            {data.map((student) => (
              <TableRow key={student.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-gray-600">{student.email}</TableCell>
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
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentManagement;
