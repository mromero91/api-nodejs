import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';

export interface ListUsersResponse {
  users: Omit<User, 'password'>[];
  total: number;
}

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<ListUsersResponse> {
    const users = await this.userRepository.findAll();

    return {
      users: users,
      total: users.length,
    };
  }
}
