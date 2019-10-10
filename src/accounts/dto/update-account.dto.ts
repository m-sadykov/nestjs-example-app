import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly lastName?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly email?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly age?: number;
}
