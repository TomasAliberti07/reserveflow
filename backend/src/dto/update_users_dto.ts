import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto} from './create_users_dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}