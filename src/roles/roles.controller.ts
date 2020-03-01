import { Controller, Get, Param, Post, Body, Patch, Delete, Inject } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto, RolePresentationDto } from './dto/role.dto';
import { ApiTags, ApiResponse, ApiBasicAuth } from '@nestjs/swagger';
import { Roles } from '../auth/auth.roles.decorator';
import { IRolesService } from './roles.service';
import { ROLES_SERVICE } from '../constants';

@ApiBasicAuth()
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    @Inject(ROLES_SERVICE)
    private readonly rolesService: IRolesService,
  ) {}

  @Get()
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: [RolePresentationDto] })
  async getAll(): Promise<RolePresentationDto[]> {
    return this.rolesService.getAll();
  }

  @Get(':id')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: RolePresentationDto })
  async findOne(@Param('id') id: string): Promise<RolePresentationDto> {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({
    status: 201,
    type: RolePresentationDto,
    description: 'Role has been successfully created.',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RolePresentationDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    type: RolePresentationDto,
    description: 'Role has been successfully updated.',
  })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RolePresentationDto> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'Role has bee successfully removed',
  })
  async removeRole(@Param('id') id: string): Promise<RolePresentationDto> {
    return this.rolesService.delete(id);
  }
}
