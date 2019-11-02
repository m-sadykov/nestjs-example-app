import { Schema } from 'mongoose';

export const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  description: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});
