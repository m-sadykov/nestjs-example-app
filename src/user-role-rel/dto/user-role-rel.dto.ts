import { ApiModelProperty } from '@nestjs/swagger';

export class UserRoleRelPresentationDto {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  userId: string;

  @ApiModelProperty()
  roleId: string;

  @ApiModelProperty()
  isDeleted: boolean;
}
