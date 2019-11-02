import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, AuthenticatedUser } from './interface/user';
import { UserRoleRel } from '../user-role-rel/interface/user-role-rel';
import { Role } from '../roles/interface/role';
import { USER_MODEL } from './constants/constants';
import { USER_ROLE_RELATION_MODEL } from '../user-role-rel/constants/constants';
import { ROLE_MODEL } from '../roles/constants/constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_MODEL)
    private readonly userModel: Model<User>,
    @Inject(USER_ROLE_RELATION_MODEL)
    private readonly userRoleRel: Model<UserRoleRel>,
    @Inject(ROLE_MODEL)
    private readonly roleModel: Model<Role>,
  ) {}

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
}
