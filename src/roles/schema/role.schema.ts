import { Schema, Document, connection } from 'mongoose';
import { ObjectId } from '../../common';
import { ROLE_MODEL } from '../../constants';

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

export const rolesModel = connection.model<RoleDocument>(ROLE_MODEL, RoleSchema, 'identity-roles');
