import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dtos/create-reminder.dto';
import { UpdateReminderDto } from './dtos/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../shared/dtos';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
    private readonly userService: UsersService,
  ) {}

  private NotFoundReminderException() {
    throw new NotFoundException('Could not find the reminder');
  }

  public async findAll(queryParams: PaginationDto): Promise<Reminder[]> {
    const { limit = 12, offset = 0 } = queryParams;
    this.logger.log(
      `Fetching all reminders. Limit: ${limit}, Offset: ${offset}`,
    );
    const result = await this.reminderRepository.find({
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });
    this.logger.log(`Found ${result.length} reminders.`);

    return result;
  }

  public async findOne(id: string): Promise<Reminder> {
    const target = await this.reminderRepository.findOne({
      where: {
        id,
      },
      relations: ['from', 'to'],
      select: {
        from: {
          id: true,
        },
        to: {
          id: true,
        },
      },
    });
    this.logger.log(`Finding reminder with ID ${id}`);
    if (!target) {
      this.NotFoundReminderException();
    }
    return target;
  }

  async create(body: CreateReminderDto): Promise<Reminder> {
    const promises = Promise.all([
      await this.userService.findOne(body.from_id),
      await this.userService.findOne(body.to_id),
    ]);
    const [fromUser, toUser] = await promises;

    const newReminder: Reminder = {
      description: body.description,
      createdAt: new Date(),
      seen: false,
      from: fromUser,
      to: toUser,
    };

    this.logger.log(`Creating a new reminder: ${JSON.stringify(newReminder)}`);

    const result = await this.reminderRepository.save(newReminder);
    return {
      ...result,
      from: {
        id: fromUser.id,
        name: fromUser.name,
        email: fromUser.email,
      },
      to: {
        id: toUser.id,
        name: toUser.name,
        email: toUser.email,
      },
    };
  }

  public async update(id: string, body: UpdateReminderDto): Promise<Reminder> {
    const exists = await this.findOne(id);
    const updatedReminder: Partial<Reminder> = {
      ...exists,
      updatedAt: new Date(),
      seen: body.seen ?? exists.seen,
      description: body.description ?? exists.description,
    };
    this.logger.log(`Updating reminder ${JSON.stringify(exists)}`);
    await this.reminderRepository.save(updatedReminder);
    return {
      ...exists,
      from: {
        id: exists.from.id,
        name: exists.from.name,
        email: exists.from.email,
      },
      to: {
        id: exists.to.id,
        name: exists.to.name,
        email: exists.to.email,
      },
    };
  }

  public async remove(id: string): Promise<Reminder> {
    const exists = await this.reminderRepository.findOne({
      where: {
        id,
      },
    });
    this.logger.log(`Deleting reminder with ID ${id}`);
    if (!exists) {
      this.NotFoundReminderException();
    }
    await this.reminderRepository.remove(exists);
    return exists;
  }
}
