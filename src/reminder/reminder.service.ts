import { Injectable, NotFoundException } from '@nestjs/common';
import { Reminder } from './entities/reminder.entity';
import { CreateReminderDto } from './dtos/create-reminder.dto';
import { UpdateReminderDto } from './dtos/update-reminder.dto';

@Injectable()
export class ReminderService {
  private lastId = 1;
  private reminders: Reminder[] = [
    {
      id: 1,
      description: 'That is it',
      from: 'joana',
      to: 'sasuke',
      seen: false,
      date: new Date(),
    },
  ];

  private NotFoundReminderException() {
    throw new NotFoundException('Could not find the reminder');
  }

  public async findAll() {
    return await this.reminders;
  }

  public async findOne(id: number) {
    const target = this.reminders.find((r) => r.id === +id);

    if (!target) {
      this.NotFoundReminderException();
    }
    return await target;
  }

  create(body: CreateReminderDto) {
    this.lastId++;
    const newId = this.lastId;
    const newReminder: Reminder = {
      id: newId,
      ...body,
      date: new Date(),
      seen: false,
    };

    this.reminders.push(newReminder);

    return newReminder;
  }

  public async update(id: number, body: UpdateReminderDto) {
    const exists = this.reminders.find((r) => r.id === +id);
    if (!exists) {
      this.NotFoundReminderException();
    }

    const updatedReminder: Reminder = {
      id,
      ...exists,
      ...body,
    };

    const result = this.reminders.map((r) => {
      if (r.id !== id) {
        return r;
      }
      return updatedReminder;
    });
    this.reminders = result;
    return updatedReminder;
  }

  private exists(id: number) {
    return !!this.reminders.find((r) => r.id === +id);
  }

  public async remove(id: number) {
    const exists = this.exists(id);
    if (!exists) {
      this.NotFoundReminderException();
    }

    this.reminders = this.reminders.filter((r) => r.id !== +id);
  }
}
