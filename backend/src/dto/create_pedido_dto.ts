import { IsNotEmpty, IsInt, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Clase interna para estructurar y validar quirúrgicamente cada renglón del pedido
export class PedidoItemDto {
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  cantidad!: number;

  @IsInt({ message: 'El ID de la bebida debe ser un número entero' })
  @IsOptional()
  bebidaId?: number;

  @IsInt({ message: 'El ID del menú debe ser un número entero' })
  @IsOptional()
  menuId?: number;
}

export class CreatePedidoDto {
  @IsInt({ message: 'El ID del proveedor debe ser un número entero' })
  @IsNotEmpty({ message: 'El proveedor es obligatorio para generar el pedido' })
  proveedorId!: number;

  @IsArray({ message: 'Los ítems del pedido deben venir en una lista' })
  @IsNotEmpty({ message: 'El pedido debe contener al menos un ítem' })
  @ValidateNested({ each: true }) // Valida recursivamente cada objeto de la lista
  @Type(() => PedidoItemDto) // Transforma el objeto plano al tipo de clase PedidoItemDto
  items!: PedidoItemDto[];
}