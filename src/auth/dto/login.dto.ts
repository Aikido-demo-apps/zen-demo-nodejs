import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty()
  email_address: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty()
  password: string;
}