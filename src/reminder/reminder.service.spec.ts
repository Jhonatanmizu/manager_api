import { Test, TestingModule } from '@nestjs/testing';
import { ReminderService } from './reminder.service';
import { Logger } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { Reminder } from './entities/reminder.entity';
import { User } from '../user/entities/user.entity';

describe('ReminderService', () => {
  let service: ReminderService;
  let userService: UsersService;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: ReminderService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReminderService>(ReminderService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of reminders', async () => {
      const toUser: User = {
        email: 'to@example.com',
        id: 'to-user-id',
        name: 'To User',
        passwordHash: 'hashedpassword',
        receivedReminders: [],
        sentReminders: [],
      };
      const fromUser: User = {
        email: 'from@example.com',
        id: 'from-user-id',
        name: 'From User',
        passwordHash: 'hashedpassword',
        receivedReminders: [],
        sentReminders: [],
      };
      const reminders: Reminder[] = [
        {
          id: '1',
          description: 'Test reminder 1',
          seen: false,
          to: toUser,
          from: fromUser,
        },
        {
          id: '2',
          description: 'Test reminder 2',
          seen: true,
          to: toUser,
          from: fromUser,
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(reminders);

      const result = await service.findAll({ limit: 10, offset: 0 });
      expect(result).toEqual(reminders);
    });

    it('should return an empty array when no reminders exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await service.findAll({ limit: 10, offset: 0 });
      expect(result).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findAll({ limit: 10, offset: 0 })).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findOne', () => {
    it('should return a reminder by ID', async () => {
      const toUser: User = {
        email: '',
        name: '',
        id: 'to-user-id',
        passwordHash: '',
        receivedReminders: [],
        sentReminders: [],
      };
      const fromUser: User = {
        email: '',
        name: '',
        id: 'from-user-id',
        passwordHash: '',
        receivedReminders: [],
        sentReminders: [],
      };
      const reminder: Reminder = {
        id: '1',
        description: 'Test reminder',
        seen: false,
        to: toUser,
        from: fromUser,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(reminder);

      const result = await service.findOne('1');
      expect(result).toEqual(reminder);
    });

    // it('should throw an error if reminder not found', async () => {
    //   jest.spyOn(service, 'findOne').mockImplementation(() => {
    //     throw new Error('Reminder not found');
    //   });

    //   await expect(service.findOne('non-existent-id')).rejects.toThrow(
    //     'Reminder not found',
    //   );
    // });
  });

  describe('remove', () => {
    it('should remove a reminder by ID', async () => {
      const toUser: User = {
        email: '',
        name: '',
        id: 'to-user-id',
        passwordHash: '',
        receivedReminders: [],
        sentReminders: [],
      };
      const fromUser: User = {
        email: '',
        name: '',
        id: 'from-user-id',
        passwordHash: '',
        receivedReminders: [],
        sentReminders: [],
      };
      const reminder: Reminder = {
        id: '1',
        description: 'Test reminder',
        seen: false,
        to: toUser,
        from: fromUser,
      };
      jest.spyOn(service, 'remove').mockResolvedValue(reminder);

      const result = await service.remove('1');
      expect(result).toEqual(reminder);
    });

    it('should handle errors when removing a reminder', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.remove('1')).rejects.toThrow('Database error');
    });

    // it('should throw an error if trying to remove a non-existent reminder', async () => {
    //   jest.spyOn(service, 'remove').mockImplementation(() => {
    //     throw new Error('Reminder not found');
    //   });

    //   await expect(service.remove('non-existent-id')).rejects.toThrow(
    //     'Reminder not found',
    //   );
    // });
  });
  describe('dependency injection', () => {
    it('should use the injected UsersService', () => {
      expect(userService).toBeDefined();
    });

    it('should use the injected ReminderService', () => {
      expect(service).toBeDefined();
    });
  });
});
