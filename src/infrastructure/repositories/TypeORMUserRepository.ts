import { Repository } from 'typeorm';
import { AppDataSource } from '@infrastructure/config/typeorm.config';
import { User as UserEntity } from '@infrastructure/entities/User.entity';
import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';

export class TypeORMUserRepository implements UserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { id } });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { email } });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findAll(): Promise<User[]> {
    const userEntities = await this.repository.find();
    return userEntities.map(entity => this.toDomain(entity));
  }

  async save(user: User): Promise<User> {
    const userEntity = this.toEntity(user);
    const savedEntity = await this.repository.save(userEntity);
    return this.toDomain(savedEntity);
  }

  async update(user: User): Promise<User> {
    const userEntity = this.toEntity(user);
    const updatedEntity = await this.repository.save(userEntity);
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  private toDomain(entity: UserEntity): User {
    return User.fromPersistence({
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      password: entity.password,
      active: entity.active,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    if (user.id) entity.id = user.id;
    entity.email = user.email;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    entity.password = user.password;
    entity.active = user.active;
    entity.role = user.role;
    if (user.createdAt) entity.createdAt = user.createdAt;
    if (user.updatedAt) entity.updatedAt = user.updatedAt;
    return entity;
  }
}
