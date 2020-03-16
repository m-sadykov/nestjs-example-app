import { authenticatedRequest } from '.';
import './config/e2e.setup';
import { UserRoleRelation } from '../../user-role-rel';
import { sample, ObjectID } from '../../common';

describe('User role relations: E2E', () => {
  let mockRelations: UserRoleRelation[];

  beforeAll(async () => {
    const response = await authenticatedRequest({
      method: 'GET',
      url: '/api/relations',
    });
    mockRelations = response.body;
  });

  describe('GET', () => {
    it('should get all relations', async () => {
      const response = await authenticatedRequest({
        method: 'GET',
        url: '/api/relations',
      });
      const relations = response.body;

      expect(response.statusCode).toBe(200);
      expect(relations.length).toBeGreaterThan(0);
    });

    it('should get role relations assigned to user by userId', async () => {
      const userId = sample(mockRelations).userId;
      const response = await authenticatedRequest({
        method: 'GET',
        url: `/api/relations/user?userId=${userId}`,
      });
      const relations: UserRoleRelation[] = response.body;

      expect(response.statusCode).toBe(200);
      relations.every(relation => {
        expect(relation.userId).toBe(userId);
      });
    });

    it('should return 404 status if role relations assigned to user not found', async () => {
      const userId = new ObjectID().toHexString();
      const response = await authenticatedRequest({
        method: 'GET',
        url: `/api/relations/user?userId=${userId}`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        error: 'RoleRelationNotFoundError',
        message: `Role relation to user ${userId} not found`,
      });
    });
  });

  describe('CREATE', () => {
    it('should assign role to user', async () => {
      const relation = {
        userId: new ObjectID().toHexString(),
        roleId: new ObjectID().toHexString(),
      };

      const response = await authenticatedRequest({
        method: 'POST',
        url: '/api/relations',
        body: relation,
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.userId).toBe(relation.userId);
      expect(response.body.roleId).toBe(relation.roleId);
    });

    it('should return 409 status if role relation already exists', async () => {
      const existingRelation = sample(mockRelations);
      const response = await authenticatedRequest({
        method: 'POST',
        url: '/api/relations',
        body: existingRelation,
      });

      expect(response.statusCode).toBe(409);
      expect(response.body).toMatchObject({
        status: 409,
        error: 'RoleRelationAlreadyExistsError',
        message: `User role relation with role id:${existingRelation.roleId} already exists`,
      });
    });
  });

  describe('DELETE', () => {
    it('should delete specific relation by id', async () => {
      const id = sample(mockRelations).id;
      const response = await authenticatedRequest({
        method: 'DELETE',
        url: `/api/relations/${id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.isDeleted).toBe(true);
    });

    it('should return 404 status if relation for delete not found', async () => {
      const id = new ObjectID().toHexString();
      const response = await authenticatedRequest({
        method: 'DELETE',
        url: `/api/relations/${id}`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        error: 'RelationNotFoundError',
        message: `Relation ${id} not found`,
      });
    });
  });
});
