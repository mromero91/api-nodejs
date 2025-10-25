import { DataSource } from 'typeorm';
import { User } from './src/infrastructure/entities/User.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'api_user',
  password: process.env.DB_PASSWORD || 'api_password',
  database: process.env.DB_NAME || 'api_db',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [User],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  subscribers: ['src/infrastructure/database/subscribers/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
});
