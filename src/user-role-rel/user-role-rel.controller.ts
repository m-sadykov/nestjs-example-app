import {
  Controller,
  Get,
  Param,
  Delete,
  Inject,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBasicAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { UserRoleRelPresentationDto } from './dto/user-role-rel.dto';
import { Roles } from '../auth';
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
  @Roles(['admin', 'guest'])
  @ApiResponse({ status: 200, type: [UserRoleRelPresentationDto] })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiOperation({
    summary: 'Get relations',
    description: 'Get all existing relations',
  })
  async getAll(): Promise<UserRoleRelPresentationDto[]> {
    return this.userRoleRelService.getAll();
  }

  @Get(':userId')
  @Roles(['admin', 'guest'])
  @ApiResponse({ status: 200, type: UserRoleRelPresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'userId',
    type: String,
    example: 'userId: 5e5eb0418aa9340f913008e5',
  })
  @ApiOperation({
    summary: 'Get relation',
    description: 'Get specific relation by userId',
  })
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
  @ApiResponse({ status: 200, type: UserRoleRelPresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiOperation({
    summary: 'Remove relation',
    description: 'Remove specific relation by id',
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
