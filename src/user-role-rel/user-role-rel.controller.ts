import {
  Inject,
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRoleRel } from './interface/user-role-rel';
import { DatabaseService } from '../database/database.service';
import { Model } from 'mongoose';
import {
  CreateRelDto,
  UserRoleRelPresentationDto,
} from './dto/user-role-rel.dto';
import { Roles } from '../auth/auth.roles.decorator';
import { UserRoleRelService } from './user-role-rel.service';
import { USER_ROLE_RELATION_MODEL } from './constants/constants';
import { Response } from 'express';

@ApiBearerAuth()
@ApiUseTags('user-role-rel')
@Controller('user-role-rel')
export class UserRoleRelController {
  constructor(
    @Inject(USER_ROLE_RELATION_MODEL)
    private readonly relationModel: Model<UserRoleRel>,
    private readonly dbService: DatabaseService,
    private readonly relationService: UserRoleRelService,
  ) {}

  @Get()
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: [UserRoleRelPresentationDto] })
  getAll(): Promise<UserRoleRel[]> {
    return this.dbService.getAll(this.relationModel);
  }

  @Get(':accountId')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: UserRoleRelPresentationDto })
  getUserRoleRelByAccountId(
    @Param('accountId') accountId: string,
  ): Promise<UserRoleRel> {
    return this.dbService.findOne(this.relationModel, accountId);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({
    status: 201,
    type: UserRoleRelPresentationDto,
    description: 'User role relation has been successfully created.',
  })
  async createUserRoleRel(
    @Body() createRelDto: CreateRelDto,
  ): Promise<UserRoleRel> {
    const isRelExists = await this.relationService.isUserRoleRelAlreadyExists(
      createRelDto,
    );

    if (isRelExists) {
      throw new BadRequestException(
        `Relation with userId ${createRelDto.userId} roleId ${
          createRelDto.roleId
        } already exists.`,
      );
    }

    return this.dbService.create(this.relationModel, createRelDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'User role relation has bee successfully removed',
  })
  async removeRel(@Param('id') id: string): Promise<Response> {
    return this.dbService.delete(this.relationModel, id);
  }
}
