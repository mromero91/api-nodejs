import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';

export interface GetUserProfileResponse {
  user: Omit<User, 'password'>;
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<GetUserProfileResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      user: user.toJSON() as GetUserProfileResponse['user'],
    };
  }
}
