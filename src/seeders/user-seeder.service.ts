import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeederService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async seed() {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin@2024!';

    const adminUser = await this.userModel.findOne({
      email: adminEmail,
    });

    if (!adminUser) {
      const newAdmin = new this.userModel({
        email: adminEmail,
        password: adminPassword,
        name: 'Admin User',
      });

      await newAdmin.save();
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
  }
}
