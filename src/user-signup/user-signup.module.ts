import { Module } from '@nestjs/common';
import { UserSignupService } from './user-signup.service';
import { UserSignupController } from './user-signup.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSignup, UserSignupSchema } from './schemas/user-signup.schema';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSignup.name, schema: UserSignupSchema },
    ]),
    EventModule,
  ],
  controllers: [UserSignupController],
  providers: [UserSignupService],
})
export class UserSignupModule {}
