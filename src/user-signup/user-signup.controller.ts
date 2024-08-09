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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User Signup')
@Controller('user-signup')
export class UserSignupController {
  constructor(private readonly userSignupService: UserSignupService) {}

  @Post()
  create(@Body() createUserSignupDto: CreateUserSignupDto) {
    return this.userSignupService.create(createUserSignupDto);
  }

  @Get()
  findAll() {
    return this.userSignupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSignupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserSignupDto: UpdateUserSignupDto,
  ) {
    return this.userSignupService.update(+id, updateUserSignupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSignupService.remove(+id);
  }
}
