import { Controller, Get, Post, Request, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const { accessToken } = await this.authService.login(req.user);
    res.cookie('access_token', accessToken, { httpOnly: true });

    return {
      message: 'Login successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async me(@Request() req) {
    const user = await this.userService.findByEmail(req.user.email);
    const result = user.toObject();

    return {
      email: result.email,
      userId: result._id,
      name: result.name,
    };
  }
}
