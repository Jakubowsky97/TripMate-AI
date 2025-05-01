import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  user?: any
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.access_token; 
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return; // 🚨 MUSISZ zrobić return po odpowiedzi
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    return next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return; // 🚨 Tutaj też return
  }
}
