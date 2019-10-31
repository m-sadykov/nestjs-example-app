import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './interface/roles.interface';
import { MongoDbService } from '../mongo-db.service';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesService } from './roles.service';

@ApiBearerAuth()
@ApiUseTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    @InjectModel('Role') private readonly roleModel: Model<Role>,
    private readonly dbService: MongoDbService,
    private readonly rolesSerivce: RolesService,
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
    type: Role,
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
  async removeRole(@Param(':id') id: string): Promise<void> {
    return this.dbService.delete(this.roleModel, id);
  }
}
