import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JWTAuthService } from '@infrastructure/services/JWTAuthService';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export class AuthMiddleware {
  private authService: JWTAuthService;

  constructor() {
    this.authService = new JWTAuthService();
  }

  authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Access token required',
        });
        return;
      }

      const token = authHeader.substring(7);

      const { userId, email } = await this.authService.verifyToken(token);

      req.userId = userId;
      req.userEmail = email;

      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  };

  // TODO IMPLEMENT: Add admin role checking logic
  requireAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.authenticate(req, res, () => {
        next();
      });
    } catch (error) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Admin access required',
      });
    }
  };
}
