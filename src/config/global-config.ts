import { registerAs } from '@nestjs/config';

export default registerAs('globalConfig', () => ({
  database: {
    type: process.env.DB_TYPE as 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: Boolean(process.env.DB_AUTOLOAD_ENTITIES),
    synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  },
  environment: process.env.NODE_ENV || 'development',
}));
