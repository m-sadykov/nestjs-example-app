import { authenticatedRequest } from '.';
import './config/e2e.setup';
import { Role, RoleForCreate } from '../../roles';
import { sample, ObjectID } from '../../common';
import * as faker from 'faker';

describe('Roles: E2E', () => {
  let mockRoles: Role[];

  beforeAll(async () => {
    const result = await authenticatedRequest({
      method: 'GET',
      url: '/api/roles',
    });
    mockRoles = result.body;
  });

  describe('GET', () => {
    it('should get all roles', async () => {
      const response = await authenticatedRequest({
        method: 'GET',
        url: '/api/roles',
      });
      const roles: Role[] = response.body;

      expect(response.statusCode).toBe(200);
      expect(roles.length).toBeGreaterThan(0);
    });

    it('should get specific role by id', async () => {
      const id = sample(mockRoles).id;
      const response = await authenticatedRequest({
        method: 'GET',
        url: `/api/roles/${id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(id);
    });

    it('should return 404 if role id not found', async () => {
      const id = new ObjectID().toHexString();
      const response = await authenticatedRequest({
        method: 'GET',
        url: `/api/roles/${id}`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        error: 'RoleNotFoundError',
        message: `Role id:${id} not found`,
      });
    });
  });

  describe('CREATE', () => {
    it('should create new role', async () => {
      const role: RoleForCreate = {
        name: faker.lorem.word(),
        displayName: faker.lorem.word().toUpperCase(),
        description: faker.lorem.sentence(),
      };

      const response = await authenticatedRequest({
        method: 'POST',
        url: '/api/roles',
        body: role,
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe(role.name);
      expect(response.body.displayName).toBe(role.displayName);
      expect(response.body.description).toBe(role.description);
    });

    it('should return 409 if role already exists', async () => {
      const existingRole = sample(mockRoles);
      const response = await authenticatedRequest({
        method: 'POST',
        url: '/api/roles',
        body: existingRole,
      });

      expect(response.statusCode).toBe(409);
      expect(response.body).toMatchObject({
        status: 409,
        error: 'RoleAlreadyExistsError',
        message: `Role name:${existingRole.name} already exists`,
      });
    });
  });

  describe('PATCH', () => {
    it('should update specific role by id', async () => {
      const id = sample(mockRoles).id;
      const patch = {
        name: faker.lorem.word(),
        displayName: faker.lorem.word().toUpperCase(),
      };

      const response = await authenticatedRequest({
        method: 'PATCH',
        url: `/api/roles/${id}`,
        body: patch,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(patch.name);
      expect(response.body.displayName).toBe(patch.displayName);
    });

    it('should return 404 status if role for update not found', async () => {
      const id = new ObjectID().toHexString();
      const patch = {
        name: faker.lorem.word(),
        displayName: faker.lorem.word().toUpperCase(),
      };

      const response = await authenticatedRequest({
        method: 'PATCH',
        url: `/api/roles/${id}`,
        body: patch,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        error: 'RoleNotFoundError',
        message: `Role id:${id} not found`,
      });
    });
  });

  describe('DELETE', () => {
    it('should delete specific role by id', async () => {
      const id = sample(mockRoles).id;
      const response = await authenticatedRequest({
        method: 'DELETE',
        url: `/api/roles/${id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.isDeleted).toBe(true);
    });

    it('should return 404 if role for delete not found', async () => {
      const id = new ObjectID().toHexString();
      const response = await authenticatedRequest({
        method: 'DELETE',
        url: `/api/roles/${id}`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        error: 'RoleNotFoundError',
        message: `Role id:${id} not found`,
      });
    });
  });
});
