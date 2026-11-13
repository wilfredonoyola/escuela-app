import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcryptjs';
import { AppConfig } from '../../config/configuration';
import { PublicUser, toPublicUser } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: PublicUser;
}

const INVALID_CREDENTIALS = 'Credenciales incorrectas';
// Hash ficticio: se compara aunque el email no exista para que el tiempo
// de respuesta no revele qué cuentas existen.
const DUMMY_HASH = hashSync('dummy-password', 10);

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  async login({ email, password }: LoginDto): Promise<LoginResponse> {
    const user = await this.users.findByEmail(email);
    const valid = await compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !valid) throw new UnauthorizedException(INVALID_CREDENTIALS);

    const payload: JwtPayload = {
      sub: String(user.id),
      email: user.email,
      rol: user.rol,
    };
    return {
      accessToken: await this.jwt.signAsync(payload),
      tokenType: 'Bearer',
      expiresIn: this.config.get('jwt', { infer: true }).expiresInSeconds,
      user: toPublicUser(user),
    };
  }

  async getProfile(userId: number): Promise<PublicUser> {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return toPublicUser(user);
  }
}
