import { AppDataSource } from '@infrastructure/config/typeorm.config';

export class DatabaseConfig {
  static async initialize(): Promise<void> {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('Database connected successfully');
      }

      // Run migrations if any exist
      await this.runMigrations();
    } catch (error) {
      throw error;
    }
  }

  private static async runMigrations(): Promise<void> {
    try {
      const migrations = await AppDataSource.runMigrations();

      if (migrations.length > 0) {
        console.log(`Executed ${migrations.length} migrations`);
      }
    } catch (error) {
      throw error;
    }
  }

  static async close(): Promise<void> {
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
    } catch (error) {
      throw error;
    }
  }
}
