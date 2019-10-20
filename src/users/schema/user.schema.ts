import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
