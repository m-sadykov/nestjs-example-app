import { usersModel } from '../schema/user.schema';
import { UserForCreate, User } from '../models/user.model';
import { UsersMapper } from '../users.repository';
import * as faker from 'faker';

faker.seed(678);

const mapper = new UsersMapper();

export async function getMockUsers() {
  const users: User[] = [];

  for (let index = 1; index < 20; index++) {
    const user: UserForCreate = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    const mockUser = await usersModel.create(user);
    users.push(mapper.fromEntity(mockUser));
  }

  return users;
}
