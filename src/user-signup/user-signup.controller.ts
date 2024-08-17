import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserSignupService } from './user-signup.service';
import { CreateUserSignupDto } from './dto/create-user-signup.dto';
import { UpdateUserSignupDto } from './dto/update-user-signup.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    enum: ['createdAt'],
    description: 'Field to sort by (createdAt)',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (ascending or descending)',
    example: 'desc',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Search string for user-signup firstName, lastName, phoneNumber',
    example: '',
  })
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
