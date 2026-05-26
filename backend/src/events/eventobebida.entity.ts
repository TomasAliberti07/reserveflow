import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './events.entity'; // Misma carpeta
import { Bebida } from '../bebida/bebida.entity'; // Subís uno y entrás a bebida

@Entity('eventobebida')
export class Eventobebida {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  evento_id!: number;

  @Column({ type: 'int' })
  bebida_id!: number;

  @Column({ type: 'int', default: 0 })
  cant!: number;

  @ManyToOne(() => Event, (event) => event.eventobebidas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'evento_id' })
  evento!: Event;

  @ManyToOne(() => Bebida, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'bebida_id' })
  bebida!: Bebida;
}