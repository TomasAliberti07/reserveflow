import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedidos.entity';
import { Menus } from '../menus/menus.entity'; 

@Entity('pedido_items')
export class PedidoItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int' })
  cantidad!: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.items, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'pedido_id' })
  pedido!: Pedido;

  @Column({ name: 'bebida_id', type: 'int', nullable: true })
  bebidaId!: number;

  @ManyToOne(() => Menus, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu!: Menus;
}