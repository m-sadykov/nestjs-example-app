import { Schema, Document } from 'mongoose';
import { ObjectId } from '../../common';

export interface RoleDocument extends Document {
  readonly _id: ObjectId;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly isDeleted: boolean;
}

export const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  description: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});
