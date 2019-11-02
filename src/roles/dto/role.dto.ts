import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly displayName: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly description: string;
}

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

export class RolePresentationDto {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  displayName: string;

  @ApiModelProperty()
  description: string;
}
