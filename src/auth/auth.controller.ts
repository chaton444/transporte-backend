import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
//controlador para la autentificacion con el endpoint de registro y login con su servicio correspondiente
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: User): Promise<User> {
    return this.authService.register(user);
  }

  @UseGuards(AuthGuard('local')) // Usa la estrategia local
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}