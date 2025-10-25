import jwt, {
  type SignOptions,
  type Secret,
  type JwtPayload,
} from 'jsonwebtoken';
import { User } from '@domain/entities/User';
import { AuthService, AuthToken } from '@domain/services/AuthService';

export class JWTAuthService implements AuthService {
  private readonly secret: Secret;
  private readonly expiresIn: string;

  constructor() {
    this.secret =
      process.env.JWT_SECRET || 'sergio-ramos-93-secret-key-monterrey';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  async generateToken(user: User): Promise<AuthToken> {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as SignOptions);

    return {
      token,
      expiresIn: this.expiresIn,
    };
  }

  async verifyToken(token: string): Promise<{ userId: string; email: string }> {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload & {
        userId: string;
        email: string;
        role: string;
      };
      return {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async refreshToken(token: string): Promise<AuthToken> {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload & {
        userId: string;
        email: string;
        role: string;
      };

      const newToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email, role: decoded.role },
        this.secret,
        { expiresIn: this.expiresIn } as SignOptions
      );

      return {
        token: newToken,
        expiresIn: this.expiresIn,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
