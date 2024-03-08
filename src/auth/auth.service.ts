import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuth } from './dto/login-auth.dto';
import { ValidationUtil } from 'src/Utils/validation.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { UserTask } from '../usersTasks/entities/userTask.entity';
import { UserDto } from 'src/usersTasks/dto/UserDto';
import { handleDBExceptions } from 'src/Utils/handleDBExceptions.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserTask)
    private usuariosRepository: Repository<UserTask>,
    private readonly jwtService: JwtService,
  ) {}
  async login(credentials: LoginAuth): Promise<UserDto> {
    const { correo, password: passwordCurretn } = credentials;
    ValidationUtil.assertNotNull(correo, 'El correo es requerido.');
    ValidationUtil.assertNotNull(
      passwordCurretn,
      'La contraseña es requerida.',
    );

    const userLogin = await this.usuariosRepository.findOne({
      where: { correo },
    });

    if (!userLogin)
      throw new UnauthorizedException(
        'El usuario y/o contraseña son incorrectos 1.',
      );
    const isPassword = await bcrypt.compare(
      passwordCurretn,
      userLogin.password,
    );

    if (!isPassword)
      throw new UnauthorizedException(
        'El usuario y/o contraseña son incorrectos 2.',
      );

    const { password, ...userWithoutPassword } = userLogin;
    return {
      ...userWithoutPassword,
      token: this.generarToken({ id: userLogin.id }),
    };
  }

  private generarToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async getRefreshToken(token: string): Promise<any> {
    try {
      const paylaod = await this.jwtService.decode(token);
      delete paylaod.iat;
      delete paylaod.exp;
      const nuevoToken = this.generarToken(paylaod);

      return {
        token: nuevoToken,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        handleDBExceptions(error, 'AuthService');
      }
    }
  }
}
