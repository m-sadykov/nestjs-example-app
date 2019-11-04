import 'reflect-metadata';
import { RolesService } from '../roles.service';
import { Test } from '@nestjs/testing';
import { ROLE_MODEL } from '../constants/constants';

describe('Roles Service', () => {
  const roleModel = {
    find: jest.fn(),
  };
  let rolesService: RolesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: ROLE_MODEL,
          useValue: roleModel,
        },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
  });

  it('isRoleAlreadyExists should return false ', async () => {
    const role = 'some_role';

    jest.spyOn(roleModel, 'find').mockImplementationOnce(async () => {
      return [];
    });

    const isUserExists = await rolesService.isRoleAlreadyExists(role);
    expect(isUserExists).toBe(false);
  });

  it('isRoleAlreadyExists should return true ', async () => {
    const role = 'some_role';

    jest.spyOn(roleModel, 'find').mockImplementationOnce(async () => {
      return [{ role }];
    });

    const isUserExists = await rolesService.isRoleAlreadyExists(role);
    expect(isUserExists).toBe(true);
  });
});
