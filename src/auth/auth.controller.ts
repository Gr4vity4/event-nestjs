import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { BlacklistService } from './blacklist.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
    private blacklistService: BlacklistService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: AuthDto })
  async login(@Request() req) {
    const { accessToken } = await this.authService.login(req.user);
    return {
      accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({ status: 200, description: 'Get profile successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@Request() req) {
    const user = await this.userService.findByEmail(req.user.email);
    const result = user.toObject();

    return {
      email: result.email,
      userId: result._id,
      name: result.name,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    this.blacklistService.addToBlacklist(token);
    return {
      message: 'Logout successful',
    };
  }
}
