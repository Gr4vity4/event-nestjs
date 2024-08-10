import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserSignupService } from './user-signup.service';
import { CreateUserSignupDto } from './dto/create-user-signup.dto';
import { UpdateUserSignupDto } from './dto/update-user-signup.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('User Signup')
@Controller('user-signup')
export class UserSignupController {
  constructor(private readonly userSignupService: UserSignupService) {}

  @Post()
  @ApiOperation({ summary: 'Create user-signup' })
  create(@Body() createUserSignupDto: CreateUserSignupDto) {
    return this.userSignupService.create(createUserSignupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user-signup' })
  findAll() {
    return this.userSignupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user-signup by id' })
  findOne(@Param('id') id: string) {
    return this.userSignupService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user-signup by id' })
  update(
    @Param('id') id: string,
    @Body() updateUserSignupDto: UpdateUserSignupDto,
  ) {
    return this.userSignupService.update(+id, updateUserSignupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user-signup by id' })
  remove(@Param('id') id: string) {
    return this.userSignupService.remove(+id);
  }
}
