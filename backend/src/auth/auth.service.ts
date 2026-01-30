import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create_users_dto';

@Injectable()
export class AuthService {
  async register(createUserDto: CreateUserDto) {
    // TEMPORAL: solo para validar que llega bien
    return {
      message: 'Usuario recibido correctamente',
      data: createUserDto,
    };
  }
}
