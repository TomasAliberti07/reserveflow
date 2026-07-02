import { PartialType } from '@nestjs/mapped-types';
import { CreateProveedorDto } from './create_proveedor_dto'; // Al mismo nivel

export class UpdateProveedorDto extends PartialType(CreateProveedorDto) {}