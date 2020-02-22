import { UsersRepository, UsersMapper } from '../users.repository';
import { usersModel } from '../schema/user.schema';
import { UserForCreate, UserForUpdate, User } from '../models/user.model';
import { establishDbConnection, closeDbConnection, sample } from '../../common';
import { getMockUsers } from './mock.data';
import * as faker from 'faker';

faker.seed(347);

describe('Users repository', () => {
  const mapper = new UsersMapper();

  let repository: UsersRepository;
  let mockUsers: User[];

  beforeAll(async () => {
    await establishDbConnection();
    mockUsers = await getMockUsers();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  beforeEach(() => {
    repository = new UsersRepository(usersModel, mapper);
  });

  it('should create user', async () => {
    const user: UserForCreate = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    const createdUser = await repository.create(user);

    expect(createdUser.id).toBeDefined();
    expect(createdUser.username).toBe(user.username);
    expect(createdUser.password).toBe(user.password);
  });

  it('should get all users', async () => {
    const users = await repository.getAll();

    expect(users.length).toBeGreaterThan(0);
  });

  it('should get non deleted users', async () => {
    const users = await repository.getAll({ isDeleted: false });

    users.map(user => {
      expect(user.isDeleted).toBe(false);
    });
  });

  it('should get user by id', async () => {
    const userForCreate = {
      id: '5e4c3dbfc074d01fe5dac20f',
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    const user = await repository.create(userForCreate);
    const foundUser = await repository.findOne(user.id);

    expect(foundUser.id).toBe(user.id);
  });

  it('should update user', async () => {
    const id = sample(mockUsers).id;
    const patch: UserForUpdate = {
      username: faker.internet.userName(),
    };

    const updatedUser = await repository.update(id, patch);
    expect(updatedUser.username).toBe(patch.username);
  });

  it('should remove user by id', async () => {
    const id = sample(mockUsers).id;

    const result = await repository.delete(id);
    expect(result.isDeleted).toBe(true);
  });
});
