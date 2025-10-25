import { User, UserRole } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { PasswordService } from '@domain/services/PasswordService';

export interface RegisterUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
}

export interface RegisterUserResponse {
  user: Omit<User, 'password'>;
  message: string;
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService
  ) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {

    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.passwordService.hash(request.password);

    const user = User.create({
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      password: hashedPassword,
      role: request.role || UserRole.USER,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      user: savedUser,
      message: 'User registered successfully',
    };
  }
}
