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
}
