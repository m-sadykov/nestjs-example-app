import {
  Controller,
  Get,
  Param,
  Delete,
  Inject,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBasicAuth } from '@nestjs/swagger';
import { UserRoleRelPresentationDto } from './dto/user-role-rel.dto';
import { Roles } from '../auth/auth.roles.decorator';
import { IUserRoleRelService } from './interfaces/interfaces';
import { USER_ROLE_RELATION_SERVICE } from '../constants';
import { identity } from 'rxjs';
import { RoleRelationNotFoundError, RelationNotFoundError } from './errors/errors';

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
    const result = await this.userRoleRelService.getByAccount(userId);

    return result.cata(error => {
      if (error instanceof RoleRelationNotFoundError) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: error.name,
          message: error.message,
        });
      }
      throw error;
    }, identity);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'User role relation has bee successfully removed',
  })
  async removeRel(@Param('id') id: string): Promise<UserRoleRelPresentationDto> {
    const result = await this.userRoleRelService.delete(id);

    return result.cata(error => {
      if (error instanceof RelationNotFoundError) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: error.name,
          message: error.message,
        });
      }
      throw error;
    }, identity);
  }
}
