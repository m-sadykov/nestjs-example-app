import { ApiModelProperty } from '@nestjs/swagger';

export class UserRoleRel {
  @ApiModelProperty()
  userId: string;

  @ApiModelProperty()
  roleId: string;
}
