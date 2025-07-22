import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import studentRoutes from './routes/student.routes';
import authRoutes from './routes/auth.routes';
import lessonRoutes from './routes/lesson.routes';
import chatRoutes from './routes/chat.routes';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger/option';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/chat', chatRoutes);

export default app;
