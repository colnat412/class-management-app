import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret!);
    console.log('Decoded token:', decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
