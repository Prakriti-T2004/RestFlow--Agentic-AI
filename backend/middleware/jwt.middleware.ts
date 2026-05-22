import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend Request interface to include userId (string for MongoDB ObjectId)
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Generate JWT Token
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: (process.env.JWT_EXPIRE || '7d') as string }
  );
};

// Verify JWT Token middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

    jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token.' 
      });
    }

    // Ensure userId is stored as string (MongoDB ObjectId)
    req.userId = (decoded && decoded.userId) ? String(decoded.userId) : undefined;
    next();
  });
};

// Optional: Verify token but don't fail if missing (for optional auth)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.userId = undefined;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err: any, decoded: any) => {
    if (err) {
      req.userId = undefined;
    } else {
      req.userId = (decoded && decoded.userId) ? String(decoded.userId) : undefined;
    }
    next();
  });
};
