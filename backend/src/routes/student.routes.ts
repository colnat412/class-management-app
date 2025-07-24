import express from 'express';
import {
  addStudentHandler,
  deleteStudentHandler,
  getStudentByEmailHandler,
  getStudentsHandler,
  searchStudentsHandler,
  updateStudentHandler,
} from '../controllers/student.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/add-student', authenticate, addStudentHandler);
router.get('/get-students', authenticate, getStudentsHandler);
router.get('/get-student-by-email', authenticate, getStudentByEmailHandler);
router.put('/update-student', authenticate, updateStudentHandler);
router.delete('/delete-student', authenticate, deleteStudentHandler);
router.get('/search-students', authenticate, searchStudentsHandler);

export default router;
