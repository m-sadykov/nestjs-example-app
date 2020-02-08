import { Document, Schema } from 'mongoose';

type ObjectId = Schema.Types.ObjectId;

export interface RoleDocument extends Document {
  id: ObjectId;
  name: string;
  displayName: string;
  description: string;
  isDeleted: boolean;
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
