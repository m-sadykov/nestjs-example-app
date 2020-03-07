import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Inject,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto, RolePresentationDto } from './dto/role.dto';
import {
  ApiTags,
  ApiResponse,
  ApiBasicAuth,
  ApiOperation,
  ApiParam,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth';
import { IRolesService } from './interfaces/interfaces';
import { ROLES_SERVICE } from '../constants';
import { identity } from 'rxjs';
import { RoleNotFoundError, RoleAlreadyExistsError } from './errors/errors';

@ApiBasicAuth()
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    @Inject(ROLES_SERVICE)
    private readonly rolesService: IRolesService,
  ) {}

  @Get()
  @Roles(['admin', 'guest'])
  @ApiResponse({ status: 200, type: [RolePresentationDto] })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiOperation({
    summary: 'Get roles',
    description: 'Get all existing roles',
  })
  async getAll(): Promise<RolePresentationDto[]> {
    return this.rolesService.getAll();
  }

  @Get(':id')
  @Roles(['admin', 'guest'])
  @ApiResponse({ status: 200, type: RolePresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiOperation({
    summary: 'Get role',
    description: 'Get specific role by id',
  })
  async findOne(@Param('id') id: string): Promise<RolePresentationDto> {
    const result = await this.rolesService.findOne(id);

    return result.cata(error => {
      if (error instanceof RoleNotFoundError) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: error.name,
          message: error.message,
        });
      }
      throw error;
    }, identity);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({ status: 201, type: RolePresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiConflictResponse({ status: 409, description: 'Conflict' })
  @ApiOperation({
    summary: 'Add new role',
    description: 'Create new role',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RolePresentationDto> {
    const result = await this.rolesService.create(createRoleDto);

    return result.cata(error => {
      if (error instanceof RoleAlreadyExistsError) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          error: error.name,
          message: error.message,
        });
      }
      throw error;
    }, identity);
  }

  @Patch(':id')
  @Roles(['admin'])
  @ApiResponse({ status: 200, type: RolePresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiOperation({
    summary: 'Update role',
    description: 'Update specific role by id',
  })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RolePresentationDto> {
    const result = await this.rolesService.update(id, updateRoleDto);

    return result.cata(error => {
      if (error instanceof RoleNotFoundError) {
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
  @ApiResponse({ status: 200, type: RolePresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiOperation({
    summary: 'Delete role',
    description: 'Remove specific role by id',
  })
  async removeRole(@Param('id') id: string): Promise<RolePresentationDto> {
    const result = await this.rolesService.delete(id);

    return result.cata(error => {
      if (error instanceof RoleNotFoundError) {
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
