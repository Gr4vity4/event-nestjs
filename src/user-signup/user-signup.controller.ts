import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserSignupService } from './user-signup.service';
import { CreateUserSignupDto } from './dto/create-user-signup.dto';
import { UpdateUserSignupDto } from './dto/update-user-signup.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('User Signup')
@Controller('user-signup')
export class UserSignupController {
  constructor(private readonly userSignupService: UserSignupService) {}

  @Post()
  @ApiOperation({ summary: 'Create user-signup' })
  create(@Body() createUserSignupDto: CreateUserSignupDto) {
    return this.userSignupService.create(createUserSignupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all user-signup' })
  findAll() {
    return this.userSignupService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user-signup by id' })
  findOne(@Param('id') id: string) {
    return this.userSignupService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user-signup by id' })
  update(
    @Param('id') id: string,
    @Body() updateUserSignupDto: UpdateUserSignupDto,
  ) {
    return this.userSignupService.update(id, updateUserSignupDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete user-signup by id' })
  // remove(@Param('id') id: string) {
  //   return this.userSignupService.remove(id);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cancel user-signup by id' })
  cancel(@Param('id') id: string) {
    return this.userSignupService.cancel(id);
  }
}
