import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('salones')
export class Salon {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'users_id' })
  user: User;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 255 })
  localizacion: string;

  @Column({ type: 'int' })
  mincapacidad: number;

  @Column({ type: 'int' })
  maxcapacidad: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'creacion' })
  creacion: Date;

  @UpdateDateColumn({ name: 'actualizacion' })
  actualizacion: Date;
}
