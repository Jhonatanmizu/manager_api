import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashingServiceProtocol } from '../auth/hashing/hashing.protocol';
import { StorageService } from '../storage/storage.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginationDto } from '../shared/dtos';
import { CreateUserDto } from './dto/create-user.dto';
import { Logger, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });
  let service: UsersService;
  let userRepo: Repository<User>;
  let hashingService: HashingServiceProtocol;
  let storageService: StorageService;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            hash: jest.fn(),
          },
        },
        {
          provide: StorageService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
    storageService = module.get<StorageService>(StorageService);
  });

  it('user service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: '',
        password: 'password123',
        birthDate: new Date('1990-01-01'),
      };
      const hashedPassword = 'hashedPassword123';
      jest.spyOn(hashingService, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(userRepo, 'save').mockResolvedValue({
        id: '1',
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: hashedPassword,
        birthDate: createUserDto.birthDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        receivedReminders: [],
        sentReminders: [],
        picture: '',
      } as User);

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.name).toBe(createUserDto.name);
      expect(result.email).toBe(createUserDto.email);
      expect(result.passwordHash).toBe(hashedPassword);
    });

    it('should throw ConflictException if email is already taken', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane Doe',
        email: '',
        password: 'password123',
        birthDate: new Date('1992-02-02'),
      };
      jest.spyOn(hashingService, 'hash').mockResolvedValue('hashedPassword123');
      jest.spyOn(userRepo, 'save').mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Email already taken',
      );
    });

    it('should throw generic error on other failures', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jake Doe',
        email: '',
        password: 'password123',
        birthDate: new Date('1993-03-03'),
      };
      jest.spyOn(hashingService, 'hash').mockResolvedValue('hashedPassword123');
      jest
        .spyOn(userRepo, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Failed to create user',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const queryParamsDto: PaginationDto = { limit: 10, offset: 0 };
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'User One',
          email: '',
          passwordHash: 'hash1',
          birthDate: new Date('1990-01-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
          receivedReminders: [],
          sentReminders: [],
          picture: '',
        },
        {
          id: '2',
          name: 'User Two',
          email: '',
          passwordHash: 'hash2',
          birthDate: new Date('1991-02-02'),
          createdAt: new Date(),
          updatedAt: new Date(),
          receivedReminders: [],
          sentReminders: [],
          picture: '',
        },
      ];
      jest.spyOn(userRepo, 'find').mockResolvedValue(mockUsers);

      const users = await service.findAll(queryParamsDto);

      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
    });

    it('should handle errors when retrieving users', async () => {
      const queryParamsDto: PaginationDto = { limit: 10, offset: 0 };
      jest
        .spyOn(userRepo, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findAll(queryParamsDto)).rejects.toThrow(
        'Failed to retrieve users',
      );
    });

    it('should return an empty users array when there are no users', async () => {
      const queryParamsDto: PaginationDto = { limit: 10, offset: 0 };
      jest.spyOn(userRepo, 'find').mockResolvedValue([]);

      const users = await service.findAll(queryParamsDto);
      expect(users).toEqual([]);
      expect(users.length).toBe(0);
    });
  });

  describe('dependency injection', () => {
    it('should have user repository injected', () => {
      expect(userRepo).toBeDefined();
    });

    it('should have hashing service injected', () => {
      expect(hashingService).toBeDefined();
    });

    it('should have storage service injected', () => {
      expect(storageService).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle creating a user with minimal data', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Minimal User',
        email: '',
        password: 'pass',
        birthDate: new Date('2000-01-01'),
      };
      jest.spyOn(hashingService, 'hash').mockResolvedValue('hashedPass');
      jest.spyOn(userRepo, 'save').mockResolvedValue({
        id: '3',
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: 'hashedPass',
        birthDate: createUserDto.birthDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        receivedReminders: [],
        sentReminders: [],
        picture: '',
      } as User);

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('3');
      expect(result.name).toBe(createUserDto.name);
    });

    it('should handle large number of users in findAll', async () => {
      const queryParamsDto: PaginationDto = { limit: 1000, offset: 0 };
      const mockUsers: User[] = [];
      for (let i = 0; i < 1000; i++) {
        mockUsers.push({
          id: `${i}`,
          name: `User ${i}`,
          email: '',
          passwordHash: `hash${i}`,
          birthDate: new Date('1990-01-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
          receivedReminders: [],
          sentReminders: [],
          picture: '',
        });
      }
      jest.spyOn(userRepo, 'find').mockResolvedValue(mockUsers);

      const users = await service.findAll(queryParamsDto);

      expect(users.length).toBe(1000);
    });
    it('should handle unexpected errors gracefully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Error User',
        email: '',
        password: 'errorpass',
        birthDate: new Date('1995-05-05'),
      };
      jest
        .spyOn(hashingService, 'hash')
        .mockRejectedValue(new Error('Hashing error'));

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Failed to create user',
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const mockUser: User = {
        id: userId,
        name: 'User One',
        email: '',
        passwordHash: 'hash1',
        birthDate: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        receivedReminders: [],
        sentReminders: [],
        picture: '',
      };
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);

      const user = await service.findOne(userId);

      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 'nonexistent';
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(undefined);
      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is deleted', async () => {
      const userId = 'deletedUser';
      const mockUser: User = {
        id: userId,
        name: 'Deleted User',
        email: '',
        passwordHash: 'hashDeleted',
        birthDate: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        receivedReminders: [],
        sentReminders: [],
        picture: '',
      };
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
