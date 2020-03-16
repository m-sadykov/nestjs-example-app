import { authenticatedRequest } from '.';
import './config/e2e.setup';
import { User } from '../../users';
import { sample, ObjectID } from '../../common';
import * as faker from 'faker';

faker.seed(65);

describe('Users: E2E', () => {
  let mockUsers: User[];

  beforeAll(async () => {
    const result = await authenticatedRequest({
      method: 'GET',
      url: '/api/users',
    });
    mockUsers = result.body;
  });

  describe('GET', () => {
    it('should get all users', async () => {
      const response = await authenticatedRequest({
        method: 'GET',
        url: '/api/users',
      });
      const users: User[] = response.body;

      expect(response.statusCode).toBe(200);
      expect(users.length).toBeGreaterThan(0);
    });

    it('should get specific user by id', async () => {
      const id = sample(mockUsers).id;
      const response = await authenticatedRequest({
        method: 'GET',
        url: `/api/users/${id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(id);
    });

    it('should return 404 status if user id not found', async () => {
      const id = new ObjectID().toHexString();

      const response = await authenticatedRequest({
        method: 'GET',
        url: `/api/users/${id}`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        error: 'UserNotFoundError',
        message: `User ${id} not found`,
      });
    });
  });

  describe('CREATE', () => {
    it('should create new user', async () => {
      const user = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      const response = await authenticatedRequest({
        method: 'POST',
        url: `/api/users/`,
        body: user,
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.username).toBe(user.username);
    });

    it('should return 409 status if user already exists', async () => {
      const existingUser = sample(mockUsers);

      const response = await authenticatedRequest({
        method: 'POST',
        url: '/api/users/',
        body: existingUser,
      });

      expect(response.statusCode).toBe(409);
      expect(response.body).toMatchObject({
        status: 409,
        error: 'UserAlreadyExistsError',
        message: `User ${existingUser.username} already exists`,
      });
    });
  });

  describe('PATCH', () => {
    it('should update specific user by id', async () => {
      const id = sample(mockUsers).id;
      const patch = {
        username: faker.internet.userName(),
      };

      const response = await authenticatedRequest({
        method: 'PATCH',
        url: `/api/users/${id}`,
        body: patch,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(id);
      expect(response.body.username).toBe(patch.username);
    });

    it('should return 404 status if user for update not found', async () => {
      const id = new ObjectID().toHexString();
      const patch = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      const response = await authenticatedRequest({
        method: 'PATCH',
        url: `/api/users/${id}`,
        body: patch,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        error: 'UserNotFoundError',
        message: `User ${id} not found`,
      });
    });
  });

  describe('DELETE', () => {
    it('should delete specific user by id', async () => {
      const id = sample(mockUsers).id;
      const response = await authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.isDeleted).toBe(true);
    });

    it('should return 404 status if user for delete not found', async () => {
      const id = new ObjectID().toHexString();
      const response = await authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${id}`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        error: 'UserNotFoundError',
        message: `User ${id} not found`,
      });
    });
  });
});
