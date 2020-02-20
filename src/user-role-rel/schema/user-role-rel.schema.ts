import { Schema, Document, connection } from 'mongoose';
import { ObjectId } from '../../common';
import { USER_ROLE_RELATION_MODEL } from '../../constants';

export interface UserRoleRelDocument extends Document {
  readonly id: ObjectId;
  readonly userId: string;
  readonly roleId: string;
}

export const UserRoleRelSchema: Schema = new Schema({
  userId: { type: String, required: true },
  roleId: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

export const userRoleRelModel = connection.model<UserRoleRelDocument>(
  USER_ROLE_RELATION_MODEL,
  UserRoleRelSchema,
  'identity-role-relations',
);
