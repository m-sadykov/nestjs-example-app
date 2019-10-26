import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './interface/roles.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel('Role')
    private readonly roleModel: Model<Role>,
  ) {}

  async isRoleAlreadyExists(name: string): Promise<boolean> {
    const query = { name };

    const [role] = await this.roleModel.find(query);

    if (role) {
      return true;
    }

    return false;
  }
}
