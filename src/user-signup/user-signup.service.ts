import { Injectable } from '@nestjs/common';
import { CreateUserSignupDto } from './dto/create-user-signup.dto';
import { UpdateUserSignupDto } from './dto/update-user-signup.dto';

@Injectable()
export class UserSignupService {
  create(createUserSignupDto: CreateUserSignupDto) {
    return 'This action adds a new userSignup';
  }

  findAll() {
    return `This action returns all userSignup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSignup`;
  }

  update(id: number, updateUserSignupDto: UpdateUserSignupDto) {
    return `This action updates a #${id} userSignup`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSignup`;
  }
}
