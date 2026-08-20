import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../users/user.entity';

@Entity('salones')
export class Salones {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'users_id' })
  @Exclude()
  user!: User;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 255 })
  localizacion!: string;

  @Column({ type: 'int' })
  mincapacidad!: number;

  @Column({ type: 'int' })
  maxcapacidad!: number;

  @Column({  type: 'smallint', default: 1 })
  estado!: number;

  @CreateDateColumn({ type: 'timestamp' })
    creacion!: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
    actualizacion!: Date;
}
