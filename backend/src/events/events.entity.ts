import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Salones } from '../salons/salons.entity';
import { Eventomenus } from './eventomenus.entity';
import { Eventobebida } from './eventobebida.entity';

@Entity('evento')
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Salones)
  @JoinColumn({ name: 'salon_id' })
  salon!: Salones;

  @Column({ length: 100 })
  cliente_nombre!: string;

  @Column({ length: 100 })
  cliente_apellido!: string;

  @Column({ length: 150 })
  cliente_email!: string;

  @Column({ length: 20 })
  cliente_numero!: string;

  @Column({ type: 'int' })
  cant_invitados!: number;

  @Column({ type: 'datetime' })
  comienzo!: Date;

  @Column({ type: 'datetime' })
  finaliza!: Date;

  @Column({ length: 50 })
  estado!: string; // pendiente | confirmado | cancelado

  @Column({ type: 'text', nullable: true })
  notas?: string;

@OneToMany(() => Eventomenus, (eventomenu) => eventomenu.evento)
eventomenus!: Eventomenus[];

@OneToMany(() => Eventobebida, (eventobebida) => eventobebida.evento)
eventobebidas!: Eventobebida[];

  @CreateDateColumn({ name: 'creado' })
  creado!: Date;

  @UpdateDateColumn({ name: 'actualizado' })
  actualizado!: Date;
}
