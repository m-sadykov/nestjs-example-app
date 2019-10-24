import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './interface/roles.interface';
import { MongodDbService } from '../mongo-db.service';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';

@ApiBearerAuth()
@ApiUseTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    @InjectModel('Role') private readonly roleModel: Model<Role>,
    private readonly dbService: MongodDbService,
  ) {}

  @Get()
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: [Role] })
  async getAll(): Promise<Role[]> {
    return this.dbService.getAll(this.roleModel);
  }

  @Get(':id')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: Role })
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.dbService.findOne(this.roleModel, id);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({
    status: 201,
    type: Role,
    description: 'Role has been successfully created.',
  })
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.dbService.create(this.roleModel, createRoleDto);
  }

  @Patch(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    type: Role,
    description: 'Role has been successfully updated.',
  })
  updateRole(
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
  removeRole(@Param(':id') id: string): Promise<void> {
    return this.dbService.delete(this.roleModel, id);
  }
}
