import { CreateReminderDto } from './create-reminder.dto';

export class UpdateReminderDto extends CreateReminderDto {
  id: number;
  seen: boolean;
}
