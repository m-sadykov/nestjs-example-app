import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import {
  CreateRoleDto,
  UpdateRoleDto,
  RolePresentationDto,
} from './dto/role.dto';
import { Model } from 'mongoose';
import { DatabaseService } from '../database/database.service';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/auth.roles.decorator';
import { RolesService } from './roles.service';
import { Response } from 'express';
import { Role } from './interface/role';
import { ROLE_MODEL } from './constants/constants';

@ApiBearerAuth()
@ApiUseTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    @Inject(ROLE_MODEL) private readonly roleModel: Model<Role>,
    private readonly dbService: DatabaseService,
    private readonly rolesSerivce: RolesService,
  ) {}

  @Get()
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: [RolePresentationDto] })
  async getAll(): Promise<Role[]> {
    return this.dbService.getAll(this.roleModel);
  }

  @Get(':id')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: RolePresentationDto })
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.dbService.findOne(this.roleModel, id);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({
    status: 201,
    type: RolePresentationDto,
    description: 'Role has been successfully created.',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    const { name } = createRoleDto;

    const isRoleExists = await this.rolesSerivce.isRoleAlreadyExists(name);

    if (isRoleExists) {
      throw new BadRequestException(`Role name ${name} already exists.`);
    }

    return this.dbService.create(this.roleModel, createRoleDto);
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
    return this.dbService.update(this.roleModel, id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'Role has bee successfully removed',
  })
  async removeRole(@Param(':id') id: string): Promise<Response> {
    return this.dbService.delete(this.roleModel, id);
  }
}
