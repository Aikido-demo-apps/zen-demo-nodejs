import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsObject() // NOSQLI INJECTION
  @ApiProperty()
  @IsOptional()
  name: any;

  @IsObject()
  @ApiProperty()
  content: string;

  @IsString()
  @ApiProperty()
  tenant_id: string;
}