import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRoleRel } from './interface/user-role-rel.interface';

@Injectable()
export class UserRoleRelService {
  constructor(
    @InjectModel('UserRoleRel')
    private readonly relationModel: Model<UserRoleRel>,
  ) {}

  async isUserRoleRelAlreadyExists(createRel: UserRoleRel): Promise<boolean> {
    const query = createRel;

    const [relation] = await this.relationModel.find(query);

    if (relation) {
      return true;
    }

    return false;
  }
}
