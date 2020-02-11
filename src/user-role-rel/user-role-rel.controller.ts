import { Inject, Controller, Get, Param, Delete } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRoleRelDocument } from './schema/user-role-rel.schema';
import { Model } from 'mongoose';
import { UserRoleRelPresentationDto } from './dto/user-role-rel.dto';
import { Roles } from '../auth/auth.roles.decorator';
import { USER_ROLE_RELATION_MODEL } from '../constants';
import { UserRoleRelation } from './models/user-role-rel.model';

export class UserRoleRelationMapper {
  fromEntity(entity: any): UserRoleRelation {
    return {
      id: entity._id,
      roleId: entity.roleId,
      userId: entity.userId,
      isDeleted: entity.isDeleted,
    };
  }
}

@ApiBearerAuth()
@ApiUseTags('user-role-rel')
@Controller('user-role-rel')
export class UserRoleRelController {
  constructor(
    @Inject(USER_ROLE_RELATION_MODEL)
    private readonly relationModel: Model<UserRoleRelDocument>,
    private readonly mapper: UserRoleRelationMapper,
  ) {}

  @Get()
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: [UserRoleRelPresentationDto] })
  async getAll(): Promise<UserRoleRelPresentationDto[]> {
    const relations = await this.relationModel.find();

    return relations.map(this.mapper.fromEntity);
  }

  @Get(':accountId')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: UserRoleRelPresentationDto })
  async getUserRoleRelByAccountId(
    @Param('accountId') accountId: string,
  ): Promise<UserRoleRelPresentationDto[]> {
    const relations = await this.relationModel.find({ accountId });

    if (!relations.length) {
      throw new Error(`Role relations for account ${accountId} not found`);
    }

    return relations.map(this.mapper.fromEntity);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'User role relation has bee successfully removed',
  })
  async removeRel(
    @Param('id') id: string,
  ): Promise<UserRoleRelPresentationDto> {
    const userRoleRel = await this.relationModel.findById(id);

    if (userRoleRel) {
      throw new Error(`Relation ${id} not found`);
    }

    const deleted = await this.relationModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    return this.mapper.fromEntity(deleted);
  }
}
