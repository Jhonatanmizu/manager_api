import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'from_id' })
  from: Partial<User>;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'to_id' })
  to: Partial<User>;
  @Column({
    type: 'boolean',
    default: false,
  })
  seen: boolean;
  @CreateDateColumn()
  createdAt?: Date;
  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
