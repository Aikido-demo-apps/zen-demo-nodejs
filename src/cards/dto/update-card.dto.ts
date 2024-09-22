import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, Length, MaxLength } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @IsString()
  @Length(16, 19)
  @ApiPropertyOptional()
  creditcard_number?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  cvc?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expires_at?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  purpose?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  spending_limit?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  tenant_id?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  created_by?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  is_active?: boolean;
}
