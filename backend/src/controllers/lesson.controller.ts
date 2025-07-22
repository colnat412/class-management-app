import { Request, Response } from 'express';
import {
  addLesson,
  assignLessonToStudent,
  deleteLesson,
  getAssignedLessons,
  getLessons,
  updateLesson,
} from '../services/lesson.service';

export const getLessonsHandler = async (req: Request, res: Response) => {
  try {
    const result = await getLessons();
    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(400).json({ error: 'Failed to fetch lessons' });
    }
  } catch (error) {
    console.error('Error in getLessonsHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const addLessonHandler = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  try {
    const result = await addLesson(title, description);
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error in addLessonHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateLessonHandler = async (req: Request, res: Response) => {
  const { id, title, description } = req.body;
  try {
    const result = await updateLesson(id, title, description);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error in updateLessonHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteLessonHandler = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const result = await deleteLesson(id);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error in deleteLessonHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const assignLessonToStudentHandler = async (
  req: Request,
  res: Response
) => {
  const { lessonId, studentIds } = req.body;
  try {
    const result = await assignLessonToStudent({ lessonId, studentIds });
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error in assignLessonToStudentHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAssignedLessonsHandler = async (
  req: Request,
  res: Response
) => {
  const { studentId } = req.params;
  try {
    const result = await getAssignedLessons(studentId);
    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res
        .status(400)
        .json({ error: 'Failed to fetch assigned lessons' });
    }
  } catch (error) {
    console.error('Error in getAssignedLessonsHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
