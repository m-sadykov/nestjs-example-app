import { ApiModelProperty } from '@nestjs/swagger';

export class Role {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  displayName: string;

  @ApiModelProperty()
  description: string;
}
