export class RoleRelationNotFoundError extends Error {
  constructor(id: string) {
    super(`Role relation to user ${id} not found`);
    this.name = 'RoleRelationNotFoundError';
  }
}

export class RelationNotFoundError extends Error {
  constructor(id: string) {
    super(`Relation ${id} not found`);
    this.name = 'RelationNotFoundError';
  }
}

export class RoleRelationAlreadyExistsError extends Error {
  constructor(roleId: string) {
    super(`User role relation with role id:${roleId} already exists`);
    this.name = 'RoleRelationAlreadyExistsError';
  }
}
