import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsBoolean, MaxLength, Length } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @MaxLength(200)
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  creditcard_number: string;

  @IsString()
  @ApiProperty()
  cvc: string;

  @IsString()
  @ApiProperty()
  expires_at: string;

  @IsString()
  @ApiProperty()
  purpose: string;

  @IsString()
  @ApiProperty()
  spending_limit: string;

  @IsString()
  @ApiProperty()
  tenant_id: string;

  @IsString()
  @ApiProperty()
  created_by: string;

  @IsBoolean()
  @ApiProperty()
  is_active: boolean;
}
