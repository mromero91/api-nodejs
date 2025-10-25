import { Application } from 'express';
import { AppConfig } from '@infrastructure/config/app.config';
import { DatabaseConfig } from '@infrastructure/database/database.config';
import { ExpressConfig } from '@interfaces/http/express.config';
import { errorHandler } from '@interfaces/middlewares/errorHandler';
import { setupRoutes } from '@interfaces/http/routes';

export class AppBootstrap {
  private app: Application;
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
    this.app = ExpressConfig.createApp(config.server);
  }

  async initialize(): Promise<void> {
    try {
      // Initialize database
      await DatabaseConfig.initialize();

      // Setup routes
      setupRoutes(this.app);

      // Setup error handling
      ExpressConfig.setupErrorHandling(this.app, errorHandler);

    } catch (error) {
      throw error;
    }
  }

  start(): void {
    ExpressConfig.startServer(this.app, this.config.server);
  }

  getApp(): Application {
    return this.app;
  }

  async shutdown(): Promise<void> {
    try {
      await DatabaseConfig.close();
    } catch (error) {
      throw error;
    }
  }
}