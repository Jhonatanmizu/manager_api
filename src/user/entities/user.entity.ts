import { File } from '../../file/entities/file.entity';
import { Reminder } from '../../reminder/entities/reminder.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;
  @Column({
    type: 'date',
    nullable: true,
  })
  birthDate?: Date | null;

  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;
  @UpdateDateColumn({
    default: null,
    nullable: true,
  })
  updatedAt?: Date;

  @Column({
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @OneToMany(() => Reminder, (reminder) => reminder.from)
  receivedReminders: Reminder[];

  @OneToMany(() => Reminder, (reminder) => reminder.to)
  sentReminders: Reminder[];

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => File, { nullable: true })
  picture?: File | null;
}
