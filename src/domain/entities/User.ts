export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface UserProps {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  active?: boolean;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(
    props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>
  ): User {
    return new User({
      ...props,
      active: props.active ?? true,
      role: props.role ?? UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get password(): string {
    return this.props.password;
  }

  get active(): boolean {
    return this.props.active ?? true;
  }

  get role(): UserRole {
    return this.props.role ?? UserRole.USER;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  updateProfile(firstName: string, lastName: string): void {
    this.props.firstName = firstName;
    this.props.lastName = lastName;
    this.props.updatedAt = new Date();
  }

  updatePassword(password: string): void {
    this.props.password = password;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.active = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.active = false;
    this.props.updatedAt = new Date();
  }

  changeRole(role: UserRole): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }

  toJSON(): Omit<UserProps, 'password'> {
    const { password, ...userWithoutPassword } = this.props;
    return userWithoutPassword;
  }
}
