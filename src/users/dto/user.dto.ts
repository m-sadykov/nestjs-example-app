import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly username?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly password?: string;
}

export class UserPresentationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  isDeleted: boolean;
}
