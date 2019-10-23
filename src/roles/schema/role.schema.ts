import * as mongoose from 'mongoose';

export const RoleSchema = new mongoose.Schema({
  name: String,
  displayName: String,
  description: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
