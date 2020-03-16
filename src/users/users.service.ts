import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Either, Left, Right } from 'monet';
import { ROLES_SERVICE, USER_ROLE_RELATION_SERVICE } from '../constants';
import {
  IRolesService,
  Role,
  RoleAlreadyExistsError,
  RoleForCreate,
  RoleNotFoundError,
} from '../roles';
import { IUserRoleRelService, RoleRelationNotFoundError } from '../user-role-rel';
import { UserAlreadyExistsError, UserNotFoundError } from './errors/errors';
import { IUsersRepository, IUsersService, QueryParams } from './interfaces/interfaces';
import { AuthenticatedUser, User, UserForCreate, UserForUpdate } from './models/user.model';

@Injectable()
export class UsersService implements IUsersService, OnModuleInit {
  constructor(
    private readonly usersRepo: IUsersRepository,
    @Inject(ROLES_SERVICE)
    private readonly rolesService: IRolesService,
    @Inject(USER_ROLE_RELATION_SERVICE)
    private readonly userRoleRelService: IUserRoleRelService,
  ) {}

  async onModuleInit() {
    const existingAdmin = await this.isUserAlreadyExists('admin');

    if (existingAdmin) {
      return;
    }

    const user: UserForCreate = {
      username: 'admin',
      password: '123',
    };

    const eitherCreate = await this.createAdminUser(user);
    return eitherCreate.map(() => {
      console.info(`Admin user created with password ${user.password}`);
    });
  }

  async getUserCredentials(
    username: string,
    password: string,
  ): Promise<Either<RoleRelationNotFoundError | RoleNotFoundError, AuthenticatedUser>> {
    const query = { username, password };
    const [user] = await this.usersRepo.getAll(query);

    type GetRoleResult = Either<RoleNotFoundError, Role>;
    const eitherGetByAccount = await this.userRoleRelService.getByAccount(user.id);
    const eitherGetRole = await eitherGetByAccount.cata(
      async (error): Promise<GetRoleResult> => Left(error),
      relations => {
        const [relation] = relations;
        return this.rolesService.findOne(relation.roleId);
      },
    );

    return eitherGetRole.map(role => ({
      username: user.username,
      roles: [role.name],
    }));
  }

  private async isUserAlreadyExists(username: string): Promise<boolean> {
    const query = { username };
    const [user] = await this.usersRepo.getAll(query);

    return Boolean(user);
  }

  private async createAdminUser(
    user: UserForCreate,
  ): Promise<Either<RoleAlreadyExistsError, User>> {
    const roleForCreate: RoleForCreate = {
      name: 'admin',
      displayName: 'ADMIN',
      description: 'admin role with access to all API routes',
    };

    const createdUser = await this.usersRepo.create(user);
    const eitherCreate = await this.rolesService.create(roleForCreate);

    eitherCreate.map(async role => {
      const relation = {
        userId: createdUser.id,
        roleId: role.id,
      };

      await this.userRoleRelService.create(relation);
    });

    return Right(createdUser);
  }

  async getAll(query?: QueryParams): Promise<User[]> {
    return this.usersRepo.getAll(query);
  }

  async findOne(id: string): Promise<Either<UserNotFoundError, User>> {
    return this.usersRepo.findOne(id);
  }

  async addUser(user: UserForCreate): Promise<Either<UserAlreadyExistsError, User>> {
    const { username } = user;
    const isUserExists = await this.isUserAlreadyExists(username);

    if (isUserExists) {
      return Left(new UserAlreadyExistsError(username));
    }

    const createdUser = await this.usersRepo.create(user);
    return Right(createdUser);
  }

  async updateUser(id: string, patch: UserForUpdate): Promise<Either<UserNotFoundError, User>> {
    return this.usersRepo.update(id, patch);
  }

  async removeUser(id: string): Promise<Either<UserNotFoundError, User>> {
    return this.usersRepo.delete(id);
  }
}
