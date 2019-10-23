import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { UserRoleRel } from './interface/user-role-rel.interface';
import { MongodDbService } from '../mongo-db.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRelDto } from './dto/create-rel.dto';

@ApiUseTags('user-role-rel')
@Controller('user-role-rel')
export class UserRoleRelController {
  constructor(
    private readonly dbService: MongodDbService,
    @InjectModel('UserRoleRel')
    private readonly relationModel: Model<UserRoleRel>,
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: [UserRoleRel] })
  getAll(): Promise<UserRoleRel[]> {
    return this.dbService.getAll(this.relationModel);
  }

  @Get(':accountId')
  @ApiResponse({ status: 200, type: UserRoleRel })
  getUserRoleRelByAccountId(
    @Param('accountId') accountId: string,
  ): Promise<UserRoleRel> {
    return this.dbService.findOne(this.relationModel, accountId);
  }

  @Post()
  @ApiResponse({
    status: 201,
    type: UserRoleRel,
    description: 'User role relation has been successfully created.',
  })
  createUserRoleRel(@Body() createRelDto: CreateRelDto): Promise<UserRoleRel> {
    return this.dbService.create(this.relationModel, createRelDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User role relation has bee successfully removed',
  })
  async emoveRel(@Param('id') id: string): Promise<void> {
    return this.dbService.delete(this.relationModel, id);
  }
}
