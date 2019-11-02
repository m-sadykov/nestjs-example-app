import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserRoleRel } from './interface/user-role-rel';
import { USER_ROLE_RELATION_MODEL } from './constants/constants';
import { CreateRelDto } from './dto/user-role-rel.dto';

@Injectable()
export class UserRoleRelService {
  constructor(
    @Inject(USER_ROLE_RELATION_MODEL)
    private readonly relationModel: Model<UserRoleRel>,
  ) {}

  async isUserRoleRelAlreadyExists(createRel: CreateRelDto): Promise<boolean> {
    const query = createRel;

    const [relation] = await this.relationModel.find(query);

    if (relation) {
      return true;
    }

    return false;
  }
}
