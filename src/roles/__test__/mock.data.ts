import { Role, RoleForCreate } from '../models/role.model';
import { RolesMapper } from '../roles.repository';
import { rolesModel } from '../schema/role.schema';
import * as faker from 'faker';

faker.seed(111);

const mapper = new RolesMapper();

export async function getMockRoles() {
  const roles: Role[] = [];

  for (let index = 1; index < 10; index++) {
    const role: RoleForCreate = {
      name: `role_${index}`,
      displayName: faker.lorem.word().toUpperCase(),
      description: faker.lorem.sentence(),
    };

    const mockRole = await rolesModel.create(role);
    roles.push(mapper.fromEntity(mockRole));
  }

  return roles;
}
