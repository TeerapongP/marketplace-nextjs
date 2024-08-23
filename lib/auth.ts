import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export const verifyToken = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // TypeScript จะรู้จัก 'user' property แล้ว
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
