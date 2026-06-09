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

  @Column({ type: 'int' })
  salon_id!: number;

  @ManyToOne(() => Salones)
  @JoinColumn({ name: 'salon_id' })
  salon!: Salones;

  // 🚀 RELACIÓN AGREGADA: Declaramos explícitamente la columna numérica users_id
  // para que coincida exacto con tu tabla de MySQL y no tire error en el .create()
  @Column({ type: 'int', name: 'users_id' })
  users_id!: number;

  @Column({ length: 100 })
  cliente_nombre!: string;

  @Column({ length: 100 })
  cliente_apellido!: string;

  @Column({ length: 150 })
  cliente_email!: string;

  @Column({ length: 20, nullable: true }) // Permitimos nullable: true en concordancia con el "YES" de tu tabla
  cliente_numero?: string;

  @Column({ type: 'int', default: 0 }) // Le asignamos el valor por defecto en la entidad tal como tu DB (YES 0)
  cant_invitados!: number;

  @Column({ type: 'datetime' })
  comienzo!: Date;

  @Column({ type: 'datetime' })
  finaliza!: Date;

  @Column({ length: 50, default: 'pendiente' })
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