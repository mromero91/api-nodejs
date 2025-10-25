import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { PasswordService } from '@domain/services/PasswordService';
import { AuthService, AuthToken } from '@domain/services/AuthService';

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  user: Omit<User, 'password'>;
  token: AuthToken;
  message: string;
}

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService,
    private authService: AuthService
  ) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {

    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.active) {
      throw new Error('User account is deactivated');
    }

    const isPasswordValid = await this.passwordService.compare(
      request.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = await this.authService.generateToken(user);

    return {
      user: user.toJSON() as LoginUserResponse['user'],
      token,
      message: 'Login successful',
    };
  }
}
