import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  CreateRoleDto,
  UpdateRoleDto,
  RolePresentationDto,
} from './dto/role.dto';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/auth.roles.decorator';
import { RolesService } from './roles.service';
import { Role } from './models/role.model';

@ApiBearerAuth()
@ApiUseTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: [RolePresentationDto] })
  async getAll(): Promise<Role[]> {
    return this.rolesService.getAll();
  }

  @Get(':id')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: RolePresentationDto })
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({
    status: 201,
    type: RolePresentationDto,
    description: 'Role has been successfully created.',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
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
  ): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'Role has bee successfully removed',
  })
  async removeRole(@Param('id') id: string): Promise<Role> {
    return this.rolesService.delete(id);
  }
}
