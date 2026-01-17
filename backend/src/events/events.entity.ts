import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Salon } from '../salons/salons.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Salon)
  @JoinColumn({ name: 'salon_id' })
  salon: Salon;

  @Column({ length: 100 })
  cliente_nombre: string;

  @Column({ length: 100 })
  cliente_apellido: string;

  @Column({ length: 150 })
  cliente_email: string;

  @Column({ length: 20 })
  cliente_numero: string;

  @Column({ type: 'int' })
  cant_invitados: number;

  @Column({ type: 'datetime' })
  comienzo: Date;

  @Column({ type: 'datetime' })
  finaliza: Date;

  @Column({ length: 50 })
  estado: string; // pendiente | confirmado | cancelado

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @CreateDateColumn({ name: 'creado' })
  creado: Date;

  @UpdateDateColumn({ name: 'actualizado' })
  actualizado: Date;
}
