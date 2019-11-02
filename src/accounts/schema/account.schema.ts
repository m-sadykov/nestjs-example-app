import { Schema } from 'mongoose';

export const AccountSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
});
