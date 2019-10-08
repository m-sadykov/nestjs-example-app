import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

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
