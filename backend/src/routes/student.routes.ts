import express from 'express';
import { addStudentHandler } from '../controllers/student.controller';

const router = express.Router();

router.post('/add-student', addStudentHandler);

export default router;
