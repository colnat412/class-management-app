import { Request, Response } from 'express';
import { signIn, verifyCode } from '../services/auth.service';

export const signInHandler = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await signIn(email);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: 'Failed to send code' });
    }
  } catch (error) {
    console.error('Error in signIn:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyCodeHandler = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  try {
    const result = await verifyCode(email, code);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in verifyCode:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
