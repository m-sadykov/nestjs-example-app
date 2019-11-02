import { Schema } from 'mongoose';

export const UserRoleRelSchema: Schema = new Schema({
  userId: { type: String, required: true },
  roleId: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});
