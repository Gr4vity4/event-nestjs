import { Test, TestingModule } from '@nestjs/testing';
import { UserSignupController } from './user-signup.controller';
import { UserSignupService } from './user-signup.service';

describe('UserSignupController', () => {
  let controller: UserSignupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSignupController],
      providers: [UserSignupService],
    }).compile();

    controller = module.get<UserSignupController>(UserSignupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
