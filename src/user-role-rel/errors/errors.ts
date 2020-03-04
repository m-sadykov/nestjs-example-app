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
