import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuth } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credenciales: LoginAuth) {
    try {
      return this.authService.login(credenciales);
    } catch (error) {
      throw new Error('Ocurrio un error al iniciar sesion.');
    }
  }

  @Post('refresh')
  async refresToken(@Headers() headers) {
    try {
      return await this.authService.getRefreshToken(headers.authorization);
    } catch (error) {
      throw new Error('Ocurrio un error al generar un token nuevo.');
    }
  }
}
