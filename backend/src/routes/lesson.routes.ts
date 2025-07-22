import express from 'express';
import {
  addLessonHandler,
  assignLessonToStudentHandler,
  deleteLessonHandler,
  getAssignedLessonsHandler,
  getLessonsHandler,
  updateLessonHandler,
} from '../controllers/lesson.controller';

const router = express.Router();

router.get('/get-lessons', getLessonsHandler);
router.post('/add-lesson', addLessonHandler);
router.put('/update-lesson', updateLessonHandler);
router.delete('/delete-lesson', deleteLessonHandler);
router.post('/assign', assignLessonToStudentHandler);
router.get('/get-assigned-lessons', getAssignedLessonsHandler);
export default router;
