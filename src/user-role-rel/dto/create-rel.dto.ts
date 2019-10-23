import { IsString, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateRelDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly roleId: string;
}
