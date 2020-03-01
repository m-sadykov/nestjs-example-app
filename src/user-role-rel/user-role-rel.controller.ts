import { Controller, Get, Param, Delete, Inject } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBasicAuth } from '@nestjs/swagger';
import { UserRoleRelPresentationDto } from './dto/user-role-rel.dto';
import { Roles } from '../auth/auth.roles.decorator';
import { IUserRoleRelService } from './user-role-rel.service';
import { USER_ROLE_RELATION_SERVICE } from '../constants';

@ApiBasicAuth()
@ApiTags('user-role-rel')
@Controller('user-role-rel')
export class UserRoleRelController {
  constructor(
    @Inject(USER_ROLE_RELATION_SERVICE)
    private readonly userRoleRelService: IUserRoleRelService,
  ) {}

  @Get()
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: [UserRoleRelPresentationDto] })
  async getAll(): Promise<UserRoleRelPresentationDto[]> {
    return this.userRoleRelService.getAll();
  }

  @Get(':userId')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: UserRoleRelPresentationDto })
  async getUserRoleRelByUserId(
    @Param('userId') userId: string,
  ): Promise<UserRoleRelPresentationDto[]> {
    return this.userRoleRelService.getByAccount(userId);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'User role relation has bee successfully removed',
  })
  async removeRel(@Param('id') id: string): Promise<UserRoleRelPresentationDto> {
    return this.userRoleRelService.delete(id);
  }
}
