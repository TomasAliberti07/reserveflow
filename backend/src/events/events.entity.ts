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

// Opcional: Definimos un tipo para TypeScript
export type EventoEstado = 'pendiente' | 'confirmado' | 'finalizado' | 'cancelado';

@Entity('evento')
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  salon_id!: number;

  @ManyToOne(() => Salones)
  @JoinColumn({ name: 'salon_id' })
  salon!: Salones;

  @Column({ type: 'int', name: 'users_id' })
  users_id!: number;

  @Column({ length: 100 })
  cliente_nombre!: string;

  @Column({ length: 100 })
  cliente_apellido!: string;

  @Column({ length: 150 })
  cliente_email!: string;

  @Column({ length: 20, nullable: true }) 
  cliente_numero?: string;

  @Column({ type: 'int', default: 0 }) 
  cant_invitados!: number;

  @Column({ type: 'datetime' })
  comienzo!: Date;

  @Column({ type: 'datetime' })
  finaliza!: Date;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'confirmado', 'finalizado', 'cancelado'],
    default: 'pendiente',
  })
  estado!: EventoEstado;

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