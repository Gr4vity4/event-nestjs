import { PartialType } from '@nestjs/swagger';
import { CreateUserSignupDto } from './create-user-signup.dto';

export class UpdateUserSignupDto extends PartialType(CreateUserSignupDto) {}
