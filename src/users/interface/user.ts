import { ApiModelProperty } from '@nestjs/swagger';

export class User {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;
}

export interface AuthenticatedUser {
  username: string;
  roles: string[];
}
