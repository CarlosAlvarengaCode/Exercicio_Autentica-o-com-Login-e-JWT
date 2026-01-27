import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    return user;
  }async refresh(userId: number, email: string) {
  const payload = { sub: userId, email };

  const accessToken = this.jwtService.sign(payload, {
    secret: process.env.JWT_SECRET_ACCESS as string,
    expiresIn: Number(process.env.JWT_EXPIRES_ACCESS),
  });

  return {
    access_token: accessToken,
  };
}

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_ACCESS')!,
      expiresIn: Number(this.configService.get<string>('JWT_EXPIRES_IN')),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH')!,
      expiresIn: Number(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
