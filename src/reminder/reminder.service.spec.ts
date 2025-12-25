import { Test, TestingModule } from '@nestjs/testing';
import { ReminderService } from './reminder.service';
import { DatabaseModule } from '../shared/database/database.module';
import { reminderProviders } from './reminder.providers';

describe('ReminderService', () => {
  let service: ReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ReminderService, ...reminderProviders],
    }).compile();

    service = module.get<ReminderService>(ReminderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a reminder', async () => {
    const reminder = await service.create({
      to: '',
      description: 'Test reminder',
      from: 'System',
    });

    expect(reminder).toHaveProperty('id');
    expect(reminder.description).toBe('Test reminder');
    expect(reminder.seen).toBe(false);
    expect(reminder).toHaveProperty('createAt');
    expect(reminder).toHaveProperty('updatedAt');
    expect(reminder.to).toBe('');
    expect(reminder.from).toBe('System');
    await service.remove(reminder.id);
  });
});
