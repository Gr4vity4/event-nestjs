import { Injectable } from '@nestjs/common';
import { CreateUserSignupDto } from './dto/create-user-signup.dto';
import { UpdateUserSignupDto } from './dto/update-user-signup.dto';
import { Model } from 'mongoose';
import { UserSignup, UserSignupDocument } from './schemas/user-signup.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserSignupService {
  constructor(
    @InjectModel(UserSignup.name)
    private userSignupModel: Model<UserSignupDocument>,
  ) {}

  async create(createUserSignupDto: CreateUserSignupDto): Promise<UserSignup> {
    return this.userSignupModel.create(createUserSignupDto);
  }

  async findAll(): Promise<UserSignup[]> {
    return this.userSignupModel.find();
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
