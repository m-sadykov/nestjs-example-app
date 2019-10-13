import * as mongoose from 'mongoose';

export const AccountSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
  isDeleted: Boolean,
});
