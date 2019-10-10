import { IsString } from 'class-validator';
import { IsOptional } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly displayName?: string;

  @IsString()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly description?: string;
}
