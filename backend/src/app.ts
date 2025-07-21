import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import studentRoutes from './routes/student.routes';
import authRoutes from './routes/auth.routes';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger/option';
import { initializeFirebase } from './firebase/init';
import { seedUsersIfEmpty } from './seeds/seed-users';

dotenv.config();

async function startServer() {
  initializeFirebase();

  await seedUsersIfEmpty();

  const app = express();

  app.use(cors());
  app.use(express.json());

  const specs = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.use('/api/auth', authRoutes);
  app.use('/api/student', studentRoutes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('❌ Error starting server:', err);
});
