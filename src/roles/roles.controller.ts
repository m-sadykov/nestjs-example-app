import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Inject,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto, RolePresentationDto } from './dto/role.dto';
import { ApiTags, ApiResponse, ApiBasicAuth } from '@nestjs/swagger';
import { Roles } from '../auth/auth.roles.decorator';
import { IRolesService } from './interface/interface';
import { ROLES_SERVICE } from '../constants';
import { identity } from 'rxjs';

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
    const result = await this.rolesService.findOne(id);

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
  @ApiResponse({
    status: 201,
    type: RolePresentationDto,
    description: 'Role has been successfully created.',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RolePresentationDto> {
    const result = await this.rolesService.create(createRoleDto);

    return result.cata(error => {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: error.name,
        message: error.message,
      });
    }, identity);
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
    const result = await this.rolesService.update(id, updateRoleDto);

    return result.cata(error => {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: error.name,
        message: error.message,
      });
    }, identity);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'Role has bee successfully removed',
  })
  async removeRole(@Param('id') id: string): Promise<RolePresentationDto> {
    const result = await this.rolesService.delete(id);

    return result.cata(error => {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: error.name,
        message: error.message,
      });
    }, identity);
  }
}
