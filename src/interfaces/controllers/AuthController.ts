import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RegisterUserUseCase } from '@application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '@application/use-cases/LoginUserUseCase';
import { TypeORMUserRepository } from '@infrastructure/repositories/TypeORMUserRepository';
import { BcryptPasswordService } from '@infrastructure/services/BcryptPasswordService';
import { JWTAuthService } from '@infrastructure/services/JWTAuthService';

export class AuthController {
  private registerUserUseCase: RegisterUserUseCase;
  private loginUserUseCase: LoginUserUseCase;

  constructor() {
    const userRepository = new TypeORMUserRepository();
    const passwordService = new BcryptPasswordService();
    const authService = new JWTAuthService();

    this.registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      passwordService
    );
    this.loginUserUseCase = new LoginUserUseCase(
      userRepository,
      passwordService,
      authService
    );
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, firstName, lastName, password, role } = req.body;

      // Validation
      if (!email || !firstName || !lastName || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Email, firstName, lastName, and password are required',
        });
        return;
      }

      const result = await this.registerUserUseCase.execute({
        email,
        firstName,
        lastName,
        password,
        role,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Email and password are required',
        });
        return;
      }

      const result = await this.loginUserUseCase.execute({
        email,
        password,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };
}
