import dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config();

import { createAppConfig } from '@infrastructure/config/app.config';
import { AppBootstrap } from '@application/bootstrap/AppBootstrap';

async function main() {
  try {
    const config = createAppConfig();

    const appBootstrap = new AppBootstrap(config);
    await appBootstrap.initialize();
    appBootstrap.start();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

main();