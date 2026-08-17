import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../dto/create_users_dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto;

    // Verificar si el email ya existe
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

    await this.userRepository.save(user);

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

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 1. Obtener perfil
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Excluimos password_hash por seguridad
    const { password_hash, ...userProfile } = user;
    return userProfile;
  }

  // 2. Actualizar perfil (nombre, apellido, teléfono)
  async updateProfile(userId: number, updateData: Partial<User>) {
    // Evitamos que modifiquen campos sensibles por este endpoint
    delete updateData.password_hash;
    delete updateData.id;

    await this.userRepository.update(userId, updateData);
    return this.getProfile(userId);
  }

  // 3. Cambiar contraseña
  async changePassword(userId: number, passwordData: { passwordActual: string; passwordNueva: string }) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const passwordMatch = await bcrypt.compare(
      passwordData.passwordActual,
      user.password_hash,
    );

    if (!passwordMatch) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(passwordData.passwordNueva, saltRounds);

    await this.userRepository.update(userId, {
      password_hash: newHashedPassword,
    });

    return { message: 'Contraseña actualizada correctamente' };
  }
}