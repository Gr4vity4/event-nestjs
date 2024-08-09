import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'admin@example.com', description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiProperty({ example: 'Admin@2024!', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
