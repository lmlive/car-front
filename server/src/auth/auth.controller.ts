import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() body: { phone: string; password: string; nickname?: string }) {
    return this.auth.register(body.phone, body.password, body.nickname);
  }

  @Post('login')
  login(@Body() body: { phone: string; password: string }) {
    return this.auth.login(body.phone, body.password);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return this.auth.getProfile(req.user.sub);
  }
}
