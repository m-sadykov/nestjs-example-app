import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, AuthenticatedUser } from './interface/user';
import { UserRoleRel } from '../user-role-rel/interface/user-role-rel.interface';
import { Role } from '../roles/interface/roles.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('UserRoleRel')
    private readonly userRoleRel: Model<UserRoleRel>,
    @InjectModel('Role')
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
