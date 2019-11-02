import { Document } from 'mongoose';

export interface UserRoleRel extends Document {
  readonly userId: string;
  readonly roleId: string;
}
