import express from 'express';
import { getChatHistoryHandler } from '../controllers/chat.controller';

const router = express.Router();

router.get('/history/:roomId', getChatHistoryHandler);

export default router;
