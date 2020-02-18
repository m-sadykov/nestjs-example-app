import { Injectable } from '@nestjs/common';
import { UserRoleRelation, UserRoleRelationForCreate } from './models/user-role-rel.model';
import { Model } from 'mongoose';
import { UserRoleRelDocument } from './schema/user-role-rel.schema';

interface IUserRoleRelationMapper {
  fromEntity(entity: any): UserRoleRelation;
}

export class UserRoleRelationMapper implements IUserRoleRelationMapper {
  fromEntity(entity: any): UserRoleRelation {
    return {
      id: entity._id.toString(),
      roleId: entity.roleId,
      userId: entity.userId,
      isDeleted: entity.isDeleted,
    };
  }
}

export interface IUserRoleRelService {
  getAll(): Promise<UserRoleRelation[]>;

  getByAccount(accountId: string): Promise<UserRoleRelation[]>;

  create(relation: UserRoleRelationForCreate): Promise<UserRoleRelation>;

  delete(id: string): Promise<UserRoleRelation>;
}

@Injectable()
export class UserRoleRelService implements IUserRoleRelService {
  constructor(
    private readonly relationModel: Model<UserRoleRelDocument>,
    private readonly mapper: IUserRoleRelationMapper,
  ) {}

  async create(relation: UserRoleRelationForCreate): Promise<UserRoleRelation> {
    const created = await this.relationModel.create(relation);

    return this.mapper.fromEntity(created);
  }

  async getAll(): Promise<UserRoleRelation[]> {
    const relations = await this.relationModel.find();

    return relations.map(this.mapper.fromEntity);
  }

  async getByAccount(accountId: string): Promise<UserRoleRelation[]> {
    const relations = await this.relationModel.find({ userId: accountId });

    if (!relations.length) {
      throw new Error(`Role relations for account ${accountId} not found`);
    }

    return relations.map(this.mapper.fromEntity);
  }

  async delete(id: string): Promise<UserRoleRelation> {
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
