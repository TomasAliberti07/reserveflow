import { PartialType } from '@nestjs/mapped-types';
import { CreateBebidaDto} from './create_bebida_dto';

export class UpdateBebidaDto extends PartialType(CreateBebidaDto) {}