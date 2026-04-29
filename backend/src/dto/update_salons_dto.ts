import { PartialType } from '@nestjs/mapped-types';
import { CreateSalonsDto } from './create_salons_dto';

export class UpdateSalonsDto extends PartialType(CreateSalonsDto) {}