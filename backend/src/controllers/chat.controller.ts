import { Request, Response } from 'express';
import { getChatHistory } from '../services/chat.service';

export const getChatHistoryHandler = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const messages = await getChatHistory(roomId);
    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load chat history' });
  }
};
