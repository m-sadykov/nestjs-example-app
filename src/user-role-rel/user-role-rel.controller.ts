import {
  Controller,
  Get,
  Param,
  Delete,
  Inject,
  NotFoundException,
  HttpStatus,
  Post,
  Body,
  ConflictException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBasicAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiConflictResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UserRoleRelPresentationDto, CreateRelationDto } from './dto/user-role-rel.dto';
import { Roles } from '../auth';
import { IUserRoleRelService } from './interfaces/interfaces';
import { USER_ROLE_RELATION_SERVICE } from '../constants';
import { identity } from 'rxjs';
import { ObjectIdValidationPipe } from '../object-id.validation.pipe';

@ApiBasicAuth()
@ApiTags('relations')
@Controller('relations')
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

  @Get('user')
  @Roles(['admin', 'guest'])
  @ApiResponse({ status: 200, type: UserRoleRelPresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiQuery({
    name: 'userId',
    required: true,
    example: 'userId: 5e5eb0418aa9340f913008e5',
    type: String,
  })
  @ApiOperation({
    summary: 'Get relation',
    description: 'Get specific relation by userId',
  })
  async getUserRoleRelByUserId(
    @Query('userId', ObjectIdValidationPipe) userId: string,
  ): Promise<UserRoleRelPresentationDto[]> {
    const result = await this.userRoleRelService.getByAccount(userId);

    return result.cata(error => {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: error.name,
        message: error.message,
      });
    }, identity);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({ status: 201, type: UserRoleRelPresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiConflictResponse({ status: 409, description: 'Relation is already exists' })
  @ApiOperation({
    summary: 'Assign role',
    description: 'Assign role to specific user',
  })
  async create(@Body() createRelationDto: CreateRelationDto) {
    const result = await this.userRoleRelService.create(createRelationDto);
    return result.cata(error => {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        error: error.name,
        message: error.message,
      });
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
  async removeRel(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<UserRoleRelPresentationDto> {
    const result = await this.userRoleRelService.delete(id);

    return result.cata(error => {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: error.name,
        message: error.message,
      });
    }, identity);
  }
}
