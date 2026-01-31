import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/user.entity';
import { CreateUserDto } from '../dto/create_users_dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto;

    //  Verificar si el email ya existe
    const userExists = await this.userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hashear contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const user = this.userRepository.create({
      ...rest,
      email,
      password_hash: hashedPassword,
      estado: true,
    });

    //  Guardar en DB
    await this.userRepository.save(user);

    //  Respuesta (NUNCA devolver password)
    return {
      message: 'Usuario creado correctamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        estado: user.estado,
        createdAt: user.createdAt,
      },
    };
  }
}
