import express from 'express';
import {
  addStudentHandler,
  deleteStudentHandler,
  getStudentsHandler,
} from '../controllers/student.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Student
 */

/**
 * @swagger
 * /api/student/add-student:
 *   post:
 *     tags:
 *       - Student
 *     summary: Add a new student
 *     responses:
 *       200:
 *         description: Student added successfully
 */
router.post('/add-student', addStudentHandler);
/**
 * @swagger
 * /api/student/get-students:
 *   get:
 *     tags:
 *       - Student
 *     summary: Get all students
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
 */
router.get('/get-students', getStudentsHandler);
router.delete('/delete-student', deleteStudentHandler);

export default router;
