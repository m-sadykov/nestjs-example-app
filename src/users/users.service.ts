import {
  Injectable,
  Inject,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User, AuthenticatedUser } from './interface/user';
import { UserRoleRel } from '../user-role-rel/interface/user-role-rel';
import { RoleDocument } from '../roles/models/role.model';
import { USER_MODEL, USER_ROLE_RELATION_MODEL, ROLE_MODEL } from '../constants';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @Inject(USER_MODEL)
    private readonly userModel: Model<User>,
    @Inject(USER_ROLE_RELATION_MODEL)
    private readonly userRoleRel: Model<UserRoleRel>,
    @Inject(ROLE_MODEL)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async onModuleInit() {
    const isUserExists = await this.isUserAlreadyExists('admin');

    if (!isUserExists) {
      const user: CreateUserDto = {
        username: 'admin',
        password: '123',
      };

      const admin = await this.createAdminUser(user);

      console.info(`Admin user created with password ${user.password}`);
      return admin;
    }
  }

  async validate(
    username: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const query = { username, password };

    const [user] = await this.userModel.find(query);

    if (user) {
      const [userRoleRel] = await this.userRoleRel.find({ userId: user._id });
      const role = await this.roleModel.findById(userRoleRel.roleId);

      return {
        username: user.username,
        roles: [role.name],
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async isUserAlreadyExists(username: string): Promise<boolean> {
    const query = { username };

    const [user] = await this.userModel.find(query);

    if (user) {
      return true;
    }

    return false;
  }

  private async createAdminUser(user: CreateUserDto) {
    const role = {
      name: 'admin',
      displayName: 'ADMIN',
      description: 'admin role with access to all API routes',
    };

    const createdUser = await this.userModel.create(user);

    const createdRole = await this.roleModel.create(role);

    const relation = {
      userId: createdUser._id,
      roleId: createdRole._id,
    };

    await this.userRoleRel.create(relation);

    return createdUser;
  }
}
