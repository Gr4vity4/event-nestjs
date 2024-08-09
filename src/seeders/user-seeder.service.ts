import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeederService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async seed() {
    const adminUser = await this.userModel.findOne({
      email: 'admin@example.com',
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('Admin@2024!', 10);
      const newAdmin = new this.userModel({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
      });

      await newAdmin.save();
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
  }
}
