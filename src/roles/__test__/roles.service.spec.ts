import { RolesService } from '../roles.service';
import { establishDbConnection, closeDbConnection, sample, ObjectID } from '../../common';
import { Role, RoleForCreate, RoleForUpdate } from '../models/role.model';
import { getMockRoles } from './mock.data';
import { RolesRepository, RolesMapper } from '../roles.repository';
import { rolesModel } from '../schema/role.schema';
import * as faker from 'faker';
import { RoleAlreadyExistsError, RoleNotFoundError } from '../errors/errors';

faker.seed(478);

describe('Roles service', () => {
  let rolesService: RolesService;
  let mockRoles: Role[];

  beforeAll(async () => {
    await establishDbConnection();
    mockRoles = await getMockRoles();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  beforeEach(() => {
    const mapper = new RolesMapper();
    const repository = new RolesRepository(rolesModel, mapper);

    rolesService = new RolesService(repository);
  });

  describe('create', () => {
    it('should create role', async () => {
      const mockRole: RoleForCreate = {
        name: faker.lorem.word(),
        displayName: faker.lorem.word().toUpperCase(),
        description: faker.lorem.sentence(),
      };

      const result = await rolesService.create(mockRole);
      const role = result.right();

      expect(role.name).toBe(mockRole.name);
      expect(role.displayName).toBe(mockRole.displayName);
      expect(role.description).toBe(mockRole.description);
    });

    it('should return "RoleAlreadyExistsError" in case if same role exists', async () => {
      const role = sample(mockRoles);

      const result = await rolesService.create(role);
      const error = result.left();

      expect(error).toBeInstanceOf(RoleAlreadyExistsError);
    });
  });

  describe('get', () => {
    it('should get all roles', async () => {
      const roles = await rolesService.getAll();

      expect(roles.length).toBeGreaterThan(0);
    });

    it('should get specific role by id', async () => {
      const id = sample(mockRoles).id;

      const result = await rolesService.findOne(id);
      const role = result.right();

      expect(role.id).toBe(id);
    });

    it('should return "RoleNotFoundError" in case if role is not found', async () => {
      const id = new ObjectID().toHexString();

      const result = await rolesService.findOne(id);
      const error = result.left();

      expect(error).toBeInstanceOf(RoleNotFoundError);
    });
  });

  describe('update', () => {
    it('should update specific role by id', async () => {
      const id = sample(mockRoles).id;
      const patch: RoleForUpdate = {
        name: 'role_for_update',
        displayName: faker.lorem.word().toUpperCase(),
        description: faker.lorem.text(),
      };

      const result = await rolesService.update(id, patch);
      const updatedRole = result.right();

      expect(updatedRole.name).toBe(patch.name);
      expect(updatedRole.displayName).toBe(patch.displayName);
      expect(updatedRole.description).toBe(patch.description);
    });

    it('should return "RoleNotFoundError" in case if role for update is not exist', async () => {
      const id = new ObjectID().toHexString();
      const patch: RoleForUpdate = {
        description: 'some_text',
      };

      const result = await rolesService.update(id, patch);
      const error = result.left();

      expect(error).toBeInstanceOf(RoleNotFoundError);
    });
  });

  describe('delete', () => {
    it('should remove specific role by id', async () => {
      const id = sample(mockRoles).id;

      const result = await rolesService.delete(id);
      const role = result.right();

      expect(role.isDeleted).toBe(true);
    });

    it('should return "RoleNotFoundError" in case if role for delete is not exist', async () => {
      const id = new ObjectID().toHexString();

      const result = await rolesService.delete(id);
      const error = result.left();

      expect(error).toBeInstanceOf(RoleNotFoundError);
    });
  });
});
