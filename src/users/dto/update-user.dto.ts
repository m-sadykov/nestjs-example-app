import { IsString, IsOptional } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly username: string;

  @IsString()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly password: string;
}
