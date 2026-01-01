import {
  Column,
  CreateDateColumn,
  Entity,
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
  @Column({
    type: 'varchar',
    length: 100,
  })
  from: string;
  @Column({
    type: 'varchar',
    length: 100,
  })
  to: string;
  @Column({
    type: 'boolean',
    default: false,
  })
  seen: boolean;
  @CreateDateColumn()
  createdAt?: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
}
