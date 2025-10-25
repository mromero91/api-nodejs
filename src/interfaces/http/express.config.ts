import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ServerConfig } from '@infrastructure/config/app.config';

export class ExpressConfig {
  static createApp(config: ServerConfig): Application {
    const app = express();

    app.use(helmet());

    app.use(cors());

    app.use(morgan('combined'));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    return app;
  }

  static setupErrorHandling(app: Application, errorHandler: any): void {
    app.use(errorHandler);
  }

  static startServer(app: Application, config: ServerConfig): void {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  }
}
