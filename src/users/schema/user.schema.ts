import { Schema, Document, connection } from 'mongoose';
import { USER_MODEL } from '../../constants';

export interface UserDocument extends Document {
  readonly username: string;
  readonly password: string;
}

export const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

export const usersModel = connection.model<UserDocument>(USER_MODEL, UserSchema, 'identity-users');
