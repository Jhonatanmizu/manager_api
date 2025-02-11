import { Reminder } from 'src/reminder/entities/reminder.entity';
import { DataSource } from 'typeorm';

export const DATA_SOURCE = 'DATA_SOURCE';

// TODO replace this using nest config add envs

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        password: 'water',
        username: 'mizu',
        port: 5432,
        host: 'localhost',
        database: 'postgres',
        synchronize: true,
        entities: [Reminder],
      });
      return dataSource.initialize();
    },
  },
];
