import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSeederService } from './user-seeder.service';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class SeederModule {}
