import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  key: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  filename: string;

  @Column({
    type: 'int',
  })
  size: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  url: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  mimeType: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
