import { Request, Response } from 'express';
import { addStudent } from '../services/student.service';

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
