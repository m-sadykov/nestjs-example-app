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

@Controller('roles')
export class RolesController {
  @Get()
  getAll() {
    return 'returns all roles';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 'returns role by id';
  }

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return 'returns created role';
  }

  @Patch()
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return 'returns updated role';
  }

  @Delete(':id')
  removeRole(@Param(':id') id: string) {
    return 'remove role';
  }
}
