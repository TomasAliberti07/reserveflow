import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { TipoProveedor } from '../proveedores/proveedor.entity'; // Ruta ajustada a tu árbol

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del proveedor es obligatorio' })
  @Length(1, 255)
  nombre!: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  rubro?: string;

  @IsString()
  @IsNotEmpty({ message: 'El celular de contacto es obligatorio' })
  @Length(1, 50)
  cel!: string;

  @IsEnum(TipoProveedor, { message: 'El tipo debe ser BEBIDA o MENU' })
  @IsNotEmpty({ message: 'El tipo de proveedor es obligatorio' })
  tipo!: TipoProveedor;
}