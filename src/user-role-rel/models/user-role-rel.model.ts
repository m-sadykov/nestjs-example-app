import { ObjectId } from '../../common';

export type UserRoleRelation = {
  readonly id: ObjectId;
  userId: string;
  roleId: string;
  isDeleted: boolean;
};

export type UserRoleRelationForCreate = Omit<
  UserRoleRelation,
  'id' | 'isDeleted'
>;
