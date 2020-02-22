import { RolesMapper, RolesRepository } from '../roles.repository';
import { Role, RoleForCreate, RoleForUpdate } from '../models/role.model';
import { establishDbConnection, closeDbConnection, sample } from '../../common';
import { rolesModel } from '../schema/role.schema';
import { getMockRoles } from './mock.data';
import * as faker from 'faker';

faker.seed(258);

describe('Roles repository', () => {
  const mapper = new RolesMapper();

  let repository: RolesRepository;
  let mockRoles: Role[];

  beforeAll(async () => {
    await establishDbConnection();
    mockRoles = await getMockRoles();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  beforeEach(() => {
    repository = new RolesRepository(rolesModel, mapper);
  });

  it('should create role', async () => {
    const mockRole: RoleForCreate = {
      name: faker.lorem.word(),
      displayName: faker.lorem.word().toUpperCase(),
      description: faker.lorem.sentence(),
    };

    const role = await repository.create(mockRole);

    expect(role.id).toBeDefined();
    expect(role.name).toBe(mockRole.name);
    expect(role.displayName).toBe(mockRole.displayName);
    expect(role.description).toBe(mockRole.description);
  });

  it('should get all roles', async () => {
    const roles = await repository.getAll();

    expect(roles.length).toBeGreaterThan(0);
  });

  it('should get specific role by id', async () => {
    const id = sample(mockRoles).id;

    const role = await repository.findOne(id);
    expect(role.id).toBe(id);
  });

  it('should return true if role is already exists', async () => {
    const roleName = sample(mockRoles).name;

    const isExistingRole = await repository.isRoleAlreadyExists(roleName);
    expect(isExistingRole).toBe(true);
  });

  it('should return false if role does not exist', async () => {
    const roleName = 'not_existing_role';

    const isExistingRole = await repository.isRoleAlreadyExists(roleName);
    expect(isExistingRole).toBe(false);
  });

  it('should update specific role', async () => {
    const id = sample(mockRoles).id;
    const patch: RoleForUpdate = {
      description: faker.lorem.sentence(),
    };

    const updatedRole = await repository.update(id, patch);
    expect(updatedRole.description).toBe(patch.description);
  });

  it('should remove specific role by id', async () => {
    const id = sample(mockRoles).id;

    const result = await repository.delete(id);
    expect(result.isDeleted).toBe(true);
  });
});
