import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Role } from './interface/role';
import { ROLE_MODEL } from './constants/constants';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLE_MODEL)
    private readonly roleModel: Model<Role>,
  ) {}

  async isRoleAlreadyExists(name: string): Promise<boolean> {
    const query = { name };

    const role = await this.roleModel.find(query);

    if (role.length > 0) {
      return true;
    }

    return false;
  }
}
