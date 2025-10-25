export interface ServerConfig {
  port: number;
  nodeEnv: string;
}

export interface DatabaseConfigInterface {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfigInterface;
}

export const createAppConfig = (): AppConfig => ({
  server: {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'api_user',
    password: process.env.DB_PASSWORD || 'api_password',
    database: process.env.DB_NAME || 'api_db',
  },
});