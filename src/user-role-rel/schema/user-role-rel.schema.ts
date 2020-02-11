import { Schema, Document } from 'mongoose';
import { ObjectId } from '../../common';

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
