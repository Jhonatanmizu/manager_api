import { DataSource } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import { DATA_SOURCE } from '../shared/database/database.providers';

export const REMINDER_REPOSITORY = 'REMINDER_REPOSITORY';

export const reminderProviders = [
  {
    provide: REMINDER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Reminder),
    inject: [DATA_SOURCE],
  },
];
