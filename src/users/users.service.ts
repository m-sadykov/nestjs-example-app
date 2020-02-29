import {
  Injectable,
  OnModuleInit,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { AuthenticatedUser, UserForCreate, User, UserForUpdate } from './models/user.model';
import { IUsersRepository } from './users.repository';
import { IRolesService } from '../roles/roles.service';
import { RoleForCreate } from '../roles/models/role.model';
import { IUserRoleRelService } from '../user-role-rel/user-role-rel.service';
import { ROLES_SERVICE, USER_ROLE_RELATION_SERVICE } from '../constants';

export type QueryParams = {
  username?: string;
  password?: string;
  isDeleted?: boolean;
};

export interface IUsersService {
  getUserCredentials(username: string, password: string): Promise<AuthenticatedUser | undefined>;

  getAll(): Promise<User[]>;

  findOne(id: string): Promise<User>;

  addUser(user: UserForCreate, roleId: string): Promise<User>;

  updateUser(id: string, patch: UserForUpdate): Promise<User>;

  removeUser(id: string): Promise<User>;
}

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
    const isUserExists = await this.isUserAlreadyExists('admin');

    if (!isUserExists) {
      const user: UserForCreate = {
        username: 'admin',
        password: '123',
      };

      const admin = await this.createAdminUser(user);

      console.info(`Admin user created with password ${user.password}`);
      return admin;
    }

    return;
  }

  async getUserCredentials(
    username: string,
    password: string,
  ): Promise<AuthenticatedUser | undefined> {
    const query = { username, password };
    const [user] = await this.usersRepo.getAll(query);

    if (user) {
      const [userRoleRel] = await this.userRoleRelService.getByAccount(user.id);
      const role = await this.rolesService.findOne(userRoleRel.roleId);

      return {
        username: user.username,
        roles: [role.name],
      };
    }

    return undefined;
  }

  private async isUserAlreadyExists(username: string): Promise<boolean> {
    const query = { username };
    const [user] = await this.usersRepo.getAll(query);

    if (user) {
      return true;
    }

    return false;
  }

  private async createAdminUser(user: UserForCreate) {
    const role: RoleForCreate = {
      name: 'admin',
      displayName: 'ADMIN',
      description: 'admin role with access to all API routes',
    };

    const createdUser = await this.usersRepo.create(user);
    const createdRole = await this.rolesService.create(role);

    const relation = {
      userId: createdUser.id,
      roleId: createdRole.id,
    };

    await this.userRoleRelService.create(relation);

    return createdUser;
  }

  async getAll(): Promise<User[]> {
    return this.usersRepo.getAll();
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepo.findOne(id);
  }

  async addUser(user: UserForCreate, roleId: string): Promise<User> {
    const { username } = user;
    const isUserExists = await this.isUserAlreadyExists(username);

    if (isUserExists) {
      throw new BadRequestException(`User ${username} already exists`);
    }

    const createdUser = await this.usersRepo.create(user);
    await this.userRoleRelService.create({ userId: createdUser.id, roleId });

    return createdUser;
  }

  async updateUser(id: string, patch: UserForUpdate): Promise<User> {
    const user = await this.usersRepo.findOne(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.usersRepo.update(id, patch);
  }

  async removeUser(id: string): Promise<User> {
    const user = await this.usersRepo.findOne(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.usersRepo.delete(id);
  }
}
