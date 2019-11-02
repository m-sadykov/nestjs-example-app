import { Document } from 'mongoose';

export interface Account extends Document {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly age: number;
}
