import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'api_password',
  database: process.env.DB_NAME || 'api_db',
  synchronize: false, // Nunca usar true en producción
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/infrastructure/entities/**/*.entity.ts'],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  subscribers: ['src/infrastructure/database/subscribers/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false, // Controlamos las migraciones manualmente
});

export default AppDataSource;