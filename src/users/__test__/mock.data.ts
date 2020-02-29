import { usersModel } from '../schema/user.schema';
import { UserForCreate, User } from '../models/user.model';
import { UsersMapper } from '../users.repository';
import * as faker from 'faker';
import { userRoleRelModel } from '../../user-role-rel/schema/user-role-rel.schema';
import { RoleForCreate } from '../../roles/models/role.model';
import { rolesModel } from '../../roles/schema/role.schema';

faker.seed(678);

const mapper = new UsersMapper();

export async function getMockUsers() {
  const users: User[] = [];

  for (let index = 1; index < 20; index++) {
    const user: UserForCreate = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    const role: RoleForCreate = {
      name: `role_${index}`,
      displayName: faker.lorem.word().toUpperCase(),
      description: faker.lorem.sentence(),
    };

    const mockRole = await rolesModel.create(role);
    const mockUser = await usersModel.create(user);
    users.push(mapper.fromEntity(mockUser));

    const relation = {
      userId: mockUser._id.toString(),
      roleId: mockRole._id.toString(),
    };
    await userRoleRelModel.create(relation);
  }

  return users;
}
