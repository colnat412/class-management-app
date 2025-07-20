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
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const studentsData = [
  { id: 1, name: 'Student 1', email: '123@gmail.com', status: 'Active' },
  { id: 2, name: 'Student 2', email: '123@gmail.com', status: 'Active' },
  { id: 3, name: 'Student 3', email: '123@gmail.com', status: 'Active' },
  { id: 4, name: 'Student 4', email: '123@gmail.com', status: 'Active' },
];

const StudentManagement = () => {
  const [data, setData] = useState(studentsData);
  const fetchData = () => {};

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
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Label htmlFor="email-1">Email Address</Label>
                    <Input
                      className="p-6"
                      id="email-1"
                      placeholder="Email Address"
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
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Label htmlFor="role-1">Role</Label>
                    <Input className="p-6" id="role-1" placeholder="Role" />
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
            {studentsData.map((student) => (
              <TableRow key={student.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-gray-600">{student.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-100"
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
