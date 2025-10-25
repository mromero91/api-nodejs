import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';

export interface UpdateUserProfileRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserProfileResponse {
  user: User;
  message: string;
}

export class UpdateUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    request: UpdateUserProfileRequest
  ): Promise<UpdateUserProfileResponse> {
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (request.firstName || request.lastName) {
      user.updateProfile(
        request.firstName || user.firstName,
        request.lastName || user.lastName
      );
    }

    const updatedUser = await this.userRepository.update(user);

    return {
      user: updatedUser.toJSON() as UpdateUserProfileResponse['user'],
      message: 'Profile updated successfully',
    };
  }
}
