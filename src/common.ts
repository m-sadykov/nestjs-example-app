import * as mongoose from 'mongoose';
// tslint:disable-next-line: no-implicit-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from './users';
import { Role } from './roles';
import { UserRoleRelation } from './user-role-rel';

export type ObjectId = mongoose.Schema.Types.ObjectId;
export const ObjectID = mongoose.mongo.ObjectId;

// testing
const mongoMemoryServer = new MongoMemoryServer();

export async function establishDbConnection() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };

  const uri = await mongoMemoryServer.getUri();
  await mongoose.connect(uri, options);
}

export async function closeDbConnection() {
  await mongoose.disconnect();
  await mongoMemoryServer.stop();
}

// lodash sample
export function sample(list: Array<UserRoleRelation>): UserRoleRelation;
export function sample(list: Array<Role>): Role;
export function sample(list: Array<User>): User;
export function sample(list: Array<any>) {
  return list[Math.floor(Math.random() * list.length)];
}
