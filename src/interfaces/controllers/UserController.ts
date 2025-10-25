import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from '@interfaces/middlewares/auth.middleware';
import { GetUserProfileUseCase } from '@application/use-cases/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '@application/use-cases/UpdateUserProfileUseCase';
import { ListUsersUseCase } from '@application/use-cases/ListUsersUseCase';
import { TypeORMUserRepository } from '@infrastructure/repositories/TypeORMUserRepository';

export class UserController {
  private getUserProfileUseCase: GetUserProfileUseCase;
  private updateUserProfileUseCase: UpdateUserProfileUseCase;
  private listUsersUseCase: ListUsersUseCase;

  constructor() {
    const userRepository = new TypeORMUserRepository();

    this.getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
    this.updateUserProfileUseCase = new UpdateUserProfileUseCase(
      userRepository
    );
    this.listUsersUseCase = new ListUsersUseCase(userRepository);
  }

  getProfile = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const result = await this.getUserProfileUseCase.execute(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to get profile',
      });
    }
  };

  updateProfile = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const { firstName, lastName } = req.body;

      const result = await this.updateUserProfileUseCase.execute({
        userId,
        firstName,
        lastName,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to update profile',
      });
    }
  };

  listUsers = async (_: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await this.listUsersUseCase.execute();

      res.status(StatusCodes.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to list users',
      });
    }
  };
}
