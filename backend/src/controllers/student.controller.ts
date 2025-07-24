import { Request, Response } from 'express';
import {
  addStudent,
  deleteStudent,
  getStudentByEmail,
  getStudents,
  searchStudents,
  updateStudent,
} from '../services/student.service';

export const addStudentHandler = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  try {
    const result = await addStudent(name, email, phone);
    if (result.success) {
      return res.status(201).json({ message: result.message });
    } else {
      return res.status(400).json({ error: 'Failed to add student' });
    }
  } catch (error) {
    console.error('Error in addStudentHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentsHandler = async (req: Request, res: Response) => {
  try {
    const result = await getStudents();
    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(400).json({ error: 'Failed to fetch students' });
    }
  } catch (error) {
    console.error('Error in getStudentsHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentByEmailHandler = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await getStudentByEmail(email);
    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in getStudentByEmailHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateStudentHandler = async (req: Request, res: Response) => {
  const { id, email, name, phone } = req.body;
  try {
    const result = await updateStudent(id, email, name, phone);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in updateStudentHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteStudentHandler = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await deleteStudent(email);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in deleteStudentHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchStudentsHandler = async (req: Request, res: Response) => {
  const { query } = req.query;
  try {
    const result = await searchStudents(query as string);
    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(400).json({ error: 'Failed to search students' });
    }
  } catch (error) {
    console.error('Error in searchStudentsHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
