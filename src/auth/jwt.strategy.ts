import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'tu_secreto_jwt', // token
    });
  }
//validar las credenciales con el token funcionando
  async validate(payload: any) {

    const user = await this.authService.validateUser(payload.email, payload.sub); 
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user; // Devuelve el usuario validado
  }
}