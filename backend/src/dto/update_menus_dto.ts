import { PartialType } from '@nestjs/mapped-types';
import { CreateMenusDto } from './create_menus_dto';

export class UpdateMenusDto extends PartialType(CreateMenusDto) {}