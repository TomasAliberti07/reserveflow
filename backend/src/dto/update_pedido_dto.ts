import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create_pedido_dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoPedido } from '../pedidos/pedidos.entity';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsEnum(EstadoPedido, { message: 'El estado debe ser PENDIENTE, CONFIRMADO, ENTREGADO o CANCELADO' })
  @IsOptional()
  estado?: EstadoPedido;
}