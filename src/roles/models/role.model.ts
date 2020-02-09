import { Document } from 'mongoose';
import { ObjectId } from '../../common';

export interface RoleDocument extends Document {
  readonly _id: ObjectId;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly isDeleted: boolean;
}

export type Role = {
  id: ObjectId;
  name: string;
  displayName: string;
  description: string;
  isDeleted: boolean;
};

export type RoleForCreate = Pick<Role, 'name' | 'displayName' | 'description'>;

export type RoleForUpdate = {
  name?: string;
  displayName?: string;
  description?: string;
};
