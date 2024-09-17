import { IsString, IsNumber, IsDate, IsBoolean, IsOptional } from 'class-validator';

export class CreateCardDto {
  @IsString()
  name: string;

  @IsString()
  creditcard_number: string;

  @IsNumber()
  cvc: number;

  @IsDate()
  expires_at: Date;

  @IsString()
  purpose: string;

  @IsString()
  spending_limit: string;

  @IsString()
  tenant_id: string;

  @IsString()
  created_by: string;

  @IsBoolean()
  is_active: boolean;
}
