import { Module } from '@nestjs/common';
import { UserSignupService } from './user-signup.service';
import { UserSignupController } from './user-signup.controller';

@Module({
  controllers: [UserSignupController],
  providers: [UserSignupService],
})
export class UserSignupModule {}
