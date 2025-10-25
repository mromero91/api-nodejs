import { User } from '@domain/entities/User';

export interface AuthToken {
  token: string;
  expiresIn: string;
}

export interface AuthService {
  generateToken(user: User): Promise<AuthToken>;
  verifyToken(token: string): Promise<{ userId: string; email: string }>;
  refreshToken(token: string): Promise<AuthToken>;
}
