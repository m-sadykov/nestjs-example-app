import { ApiModelProperty } from '@nestjs/swagger';
import { ObjectId } from '../../common';

export class UserRoleRelPresentationDto {
  @ApiModelProperty()
  id: ObjectId;

  @ApiModelProperty()
  userId: string;

  @ApiModelProperty()
  roleId: string;

  @ApiModelProperty()
  isDeleted: boolean;
}
