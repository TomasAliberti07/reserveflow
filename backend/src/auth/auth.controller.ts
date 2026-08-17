import { Controller, Post, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create_users_dto';
import { LoginDto } from '../dto/login_dto';
import { JwtAuthGuard } from './jwt_auth_guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  // 1. Obtener perfil del usuario logueado
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // req.user proviene del JwtStrategy tras validar el token
    return this.authService.getProfile(req.user.id);
  }

  // 2. Actualizar perfil (nombre, apellido, teléfono)
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Request() req, @Body() updateData: any) {
    return this.authService.updateProfile(req.user.id, updateData);
  }

  // 3. Cambiar contraseña
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@Request() req, @Body() passwordData: any) {
    return this.authService.changePassword(req.user.id, passwordData);
  }
}