import { ApiProperty } from '@nestjs/swagger';

export class UserRoleRelPresentationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  isDeleted: boolean;
}
