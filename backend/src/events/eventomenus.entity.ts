import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './events.entity'; // Misma carpeta: ./events.entity
import { Menus } from '../menus/menus.entity'; // Subís uno y entrás a menus

@Entity('eventomenus')
export class Eventomenus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  evento_id!: number;

  @Column({ type: 'int' })
  menu_id!: number;

  @Column({ type: 'int', default: 1 })
  cantidad!: number;

  @ManyToOne(() => Event, (event) => event.eventomenus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'evento_id' })
  evento!: Event;

  @ManyToOne(() => Menus, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'menu_id' })
  menu!: Menus;
}