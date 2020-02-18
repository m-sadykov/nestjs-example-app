export type UserRoleRelation = {
  readonly id: string;
  userId: string;
  roleId: string;
  isDeleted: boolean;
};

export type UserRoleRelationForCreate = Omit<
  UserRoleRelation,
  'id' | 'isDeleted'
>;
