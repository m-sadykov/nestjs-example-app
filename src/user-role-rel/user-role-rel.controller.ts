import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRoleRel } from './interface/user-role-rel.interface';
import { MongodDbService } from '../mongo-db.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRelDto } from './dto/create-rel.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRoleRelService } from './user-role-rel.service';

@ApiBearerAuth()
@ApiUseTags('user-role-rel')
@Controller('user-role-rel')
export class UserRoleRelController {
  constructor(
    @InjectModel('UserRoleRel')
    private readonly relationModel: Model<UserRoleRel>,
    private readonly dbService: MongodDbService,
    private readonly relationService: UserRoleRelService,
  ) {}

  @Get()
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: [UserRoleRel] })
  getAll(): Promise<UserRoleRel[]> {
    return this.dbService.getAll(this.relationModel);
  }

  @Get(':accountId')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: UserRoleRel })
  getUserRoleRelByAccountId(
    @Param('accountId') accountId: string,
  ): Promise<UserRoleRel> {
    return this.dbService.findOne(this.relationModel, accountId);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({
    status: 201,
    type: UserRoleRel,
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
  async removeRel(@Param('id') id: string): Promise<void> {
    return this.dbService.delete(this.relationModel, id);
  }
}
