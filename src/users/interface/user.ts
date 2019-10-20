import { ApiModelProperty } from '@nestjs/swagger';

export class User {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;
}
