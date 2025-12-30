import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dtos/create-reminder.dto';
import { UpdateReminderDto } from './dtos/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';
import { REMINDER_REPOSITORY } from './reminder.providers';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: Repository<Reminder>,
  ) {}

  private NotFoundReminderException() {
    throw new NotFoundException('Could not find the reminder');
  }

  public async findAll(
    limit: number = 12,
    offset: number = 0,
  ): Promise<Reminder[]> {
    this.logger.log(
      `Fetching all reminders. Limit: ${limit}, Offset: ${offset}`,
    );
    const result = await this.reminderRepository.find({
      take: limit,
      skip: offset,
    });
    this.logger.log(`Found ${result.length} reminders.`);

    return result;
  }

  public async findOne(id: string): Promise<Reminder> {
    const target = await this.reminderRepository.findOne({
      where: {
        id,
      },
    });
    this.logger.log(`Finding reminder with ID ${id}`);
    if (!target) {
      this.NotFoundReminderException();
    }
    return target;
  }

  async create(body: CreateReminderDto): Promise<Reminder> {
    const newReminder: Reminder = {
      ...body,
      createAt: new Date(),
      seen: false,
    };
    this.logger.log(`Creating a new reminder: ${JSON.stringify(newReminder)}`);

    await this.reminderRepository.save(newReminder);
    return newReminder;
  }

  public async update(id: string, body: UpdateReminderDto): Promise<Reminder> {
    const exists = await this.reminderRepository.preload({
      seen: body.seen,
      to: body.to,
      updatedAt: new Date(),
      id,
      description: body.description,
      from: body.from,
    });
    this.logger.log(`Updating reminder ${JSON.stringify(exists)}`);
    if (!exists) {
      this.NotFoundReminderException();
    }

    await this.reminderRepository.save(exists);
    return exists;
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
