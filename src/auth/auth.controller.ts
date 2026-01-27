import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshGuard } from './refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: any) {
    const user = req.user; 


    return this.authService.refresh(user.sub, user.email);
  }
}
