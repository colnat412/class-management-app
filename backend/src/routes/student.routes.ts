import express from 'express';
import {
  addStudentHandler,
  deleteStudentHandler,
  getStudentByEmailHandler,
  getStudentsHandler,
  updateStudentHandler,
} from '../controllers/student.controller';

const router = express.Router();

router.post('/add-student', addStudentHandler);
router.get('/get-students', getStudentsHandler);
router.get('/get-student-by-email', getStudentByEmailHandler);
router.put('/update-student', updateStudentHandler);
router.delete('/delete-student', deleteStudentHandler);

export default router;
