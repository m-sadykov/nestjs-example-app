import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly lastName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly email: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly age: number;
}

export class UpdateAccountDto {
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

export class AccountPresentationDto {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  firstName: string;

  @ApiModelProperty()
  lastName: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  age: number;
}
