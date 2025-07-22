import { Request, Response } from 'express';
import { getChatHistory } from '../services/chat.service';

export const getChatHistoryHandler = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;

    const messages = await getChatHistory(roomId);

    const response = {
      success: true,
      count: messages.length,
      roomId: roomId,
      data: messages,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error('=== ERROR in getChatHistoryHandler ===', err);
    return res.status(500).json({ error: 'Failed to load chat history' });
  }
};
