import * as mongoose from 'mongoose';

export const AccountSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
