import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @IsString()
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
