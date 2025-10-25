import { AppDataSource } from '@infrastructure/config/typeorm.config';

export class TypeORMMigrationRunner {
  private dataSource = AppDataSource;

  async runMigrations(): Promise<void> {
    try {
      await this.dataSource.initialize();
      console.log('Database connection established');

      const migrations = await this.dataSource.runMigrations();

      if (migrations.length === 0) {
        console.log('No new migrations to run');
      } else {
        console.log(`Successfully ran ${migrations.length} migrations:`);
        migrations.forEach(migration => {
          console.log(`- ${migration.name}`);
        });
      }
    } catch (error) {
      console.error('Error running migrations:', error);
      throw error;
    } finally {
      await this.dataSource.destroy();
    }
  }

  async showMigrationStatus(): Promise<void> {
    try {
      await this.dataSource.initialize();
      console.log('Database connection established');

      const executedMigrations = await this.dataSource.query(
        'SELECT * FROM typeorm_migrations ORDER BY timestamp'
      );

      console.log('Migration Status:');
      if (executedMigrations.length === 0) {
        console.log('No migrations have been executed');
      } else {
        executedMigrations.forEach((migration: any) => {
          console.log(`✓ ${migration.name} (${migration.timestamp})`);
        });
      }
    } catch (error) {
      console.error('Error checking migration status:', error);
      throw error;
    } finally {
      await this.dataSource.destroy();
    }
  }

  async revertLastMigration(): Promise<void> {
    try {
      await this.dataSource.initialize();
      console.log('Database connection established');

      await this.dataSource.undoLastMigration();
      console.log('Last migration reverted successfully');
    } catch (error) {
      console.error('Error reverting migration:', error);
      throw error;
    } finally {
      await this.dataSource.destroy();
    }
  }

  async close(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}

// Ejecutar migraciones si se llama directamente
if (require.main === module) {
  const runner = new TypeORMMigrationRunner();
  runner
    .runMigrations()
    .then(() => {
      console.log('Migration process completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}
