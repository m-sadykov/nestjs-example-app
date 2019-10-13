import { ApiModelProperty } from '@nestjs/swagger';

export class Account {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  firstName: string;

  @ApiModelProperty()
  lastName: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  age: number;
}
