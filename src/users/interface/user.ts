import { Document } from 'mongoose';

export interface User extends Document {
  readonly username: string;
  readonly password: string;
}

export interface AuthenticatedUser {
  readonly username: string;
  readonly roles: string[];
}
