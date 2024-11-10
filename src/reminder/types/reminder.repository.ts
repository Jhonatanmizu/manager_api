export interface ReminderRepository {
  findAll: () => Promise<void>;
  findOne: (id: string) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  create: () => Promise<void>;
}
