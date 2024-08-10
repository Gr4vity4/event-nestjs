import { Types } from 'mongoose';
import { IsString, IsNotEmpty, MinLength, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserSignupDto {
  @IsNotEmpty()
  @IsMongoId()
  @Transform(({ value }) => new Types.ObjectId(value))
  readonly eventId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  readonly phoneNumber: string;
}
