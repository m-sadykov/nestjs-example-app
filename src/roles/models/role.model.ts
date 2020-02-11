import { ObjectId } from '../../common';

export type Role = {
  readonly id: ObjectId;
  name: string;
  displayName: string;
  description: string;
  isDeleted: boolean;
};

export type RoleForCreate = Pick<Role, 'name' | 'displayName' | 'description'>;

export type RoleForUpdate = {
  name?: string;
  displayName?: string;
  description?: string;
};
