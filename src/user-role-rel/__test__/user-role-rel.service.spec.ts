import 'reflect-metadata';
import { UserRoleRelService } from '../user-role-rel.service';
import { Test } from '@nestjs/testing';
import { USER_ROLE_RELATION_MODEL } from '../../constants';

describe('UserRoleRelService', () => {
  const userRoleRelModel = {
    find: jest.fn(),
  };
  let userRoleRelService: UserRoleRelService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRoleRelService,
        {
          provide: USER_ROLE_RELATION_MODEL,
          useValue: userRoleRelModel,
        },
      ],
    }).compile();

    userRoleRelService = module.get<UserRoleRelService>(UserRoleRelService);
  });

  it('isUserRoleRelAlreadyExists should return true', async () => {
    const relation = getMockRelation();

    jest.spyOn(userRoleRelModel, 'find').mockImplementationOnce(async () => {
      return [relation];
    });

    const isRelationExists = await userRoleRelService.isUserRoleRelAlreadyExists(
      relation,
    );
    expect(isRelationExists).toBe(true);
  });

  it('isUserRoleRelAlreadyExists should return false', async () => {
    const relation = getMockRelation();

    jest.spyOn(userRoleRelModel, 'find').mockImplementationOnce(async () => {
      return [];
    });

    const isRelationExists = await userRoleRelService.isUserRoleRelAlreadyExists(
      relation,
    );
    expect(isRelationExists).toBe(false);
  });

  const getMockRelation = () => {
    return {
      userId: 'some_id',
      roleId: 'some_other_id',
    };
  };
});
