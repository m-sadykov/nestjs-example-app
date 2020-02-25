import { UserRoleRelationMapper, UserRoleRelService } from '../user-role-rel.service';
import { userRoleRelModel } from '../schema/user-role-rel.schema';
import { getMockUserRoleRelations } from './mock.data';
import { establishDbConnection, closeDbConnection, sample, objectId } from '../../common';
import { UserRoleRelation, UserRoleRelationForCreate } from '../models/user-role-rel.model';

describe('UserRoleRelations service', () => {
  let userRoleRelService: UserRoleRelService;
  let mockRelations: UserRoleRelation[];

  beforeEach(() => {
    const mapper = new UserRoleRelationMapper();
    userRoleRelService = new UserRoleRelService(userRoleRelModel, mapper);
  });

  beforeAll(async () => {
    await establishDbConnection();
    mockRelations = await getMockUserRoleRelations();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  it('should get all relations', async () => {
    const relations = await userRoleRelService.getAll();

    expect(relations.length).toBeGreaterThan(0);
  });

  it('should get specific relation by userId', async () => {
    const userId = sample(mockRelations).userId;
    const relations = await userRoleRelService.getByAccount(userId);

    expect(relations.length).toBeGreaterThan(0);
    expect(relations.every(Boolean)).toBe(true);
  });

  it('should create new relation', async () => {
    const rel: UserRoleRelationForCreate = {
      roleId: new objectId().toHexString(),
      userId: new objectId().toHexString(),
    };

    const createdRel = await userRoleRelService.create(rel);

    expect(createdRel.roleId).toBe(rel.roleId);
    expect(createdRel.userId).toBe(rel.userId);
  });

  it('should remove specific relation by id', async () => {
    const id = sample(mockRelations).id;

    const removedRelation = await userRoleRelService.delete(id);
    expect(removedRelation.isDeleted).toBe(true);
  });
});
