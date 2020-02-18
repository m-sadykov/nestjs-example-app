import { Controller, Get, Param, Delete, Inject } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRoleRelPresentationDto } from './dto/user-role-rel.dto';
import { Roles } from '../auth/auth.roles.decorator';
import { IUserRoleRelService } from './user-role-rel.service';
import { USER_ROLE_RELATION_SERVICE } from '../constants';

@ApiBearerAuth()
@ApiUseTags('user-role-rel')
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

  @Get(':accountId')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: UserRoleRelPresentationDto })
  async getUserRoleRelByAccountId(
    @Param('accountId') accountId: string,
  ): Promise<UserRoleRelPresentationDto[]> {
    return this.userRoleRelService.getByAccount(accountId);
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
