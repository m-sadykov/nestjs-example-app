export type Role = {
  readonly id: string;
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
