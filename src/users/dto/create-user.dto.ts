import { IsString, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly password: string;
}
