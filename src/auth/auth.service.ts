import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
//metodos para el servicio de validar los usuarios,registrar y login
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),//da acceso al token
    };
  }

  async register(user: User): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: user.email } });
    if (existingUser) {
      throw new UnauthorizedException('El usuario ya existe, Intenta con otro');
    }
    user.password = await bcrypt.hash(user.password, 10);
    return this.userRepository.save(user);
  }
}