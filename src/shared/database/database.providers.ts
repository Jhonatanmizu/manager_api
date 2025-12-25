import { Reminder } from '../../reminder/entities/reminder.entity';
import { DataSource } from 'typeorm';

export const DATA_SOURCE = 'DATA_SOURCE';

const DB_PORT = Number(process.env.DB_PORT) ?? 5432;

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        entities: [Reminder],
      });

      return dataSource.initialize();
    },
  },
];
