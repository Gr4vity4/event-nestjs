import { Test, TestingModule } from '@nestjs/testing';
import { UserSignupService } from './user-signup.service';

describe('UserSignupService', () => {
  let service: UserSignupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSignupService],
    }).compile();

    service = module.get<UserSignupService>(UserSignupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
