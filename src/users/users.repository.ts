import { UserForCreate, User, UserForUpdate } from './models/user.model';
import { UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { QueryParams } from './users.service';

export interface IUsersRepository {
  create(user: UserForCreate): Promise<User>;

  getAll(query?: QueryParams): Promise<User[]>;

  findOne(id: string): Promise<User>;

  update(id: string, patch: UserForUpdate): Promise<User>;

  delete(id: string): Promise<User>;
}

interface IUsersMapper {
  fromEntity(entity: any): User;
}

export class UsersMapper implements IUsersMapper {
  fromEntity(entity: any): User {
    return {
      id: entity._id.toString(),
      username: entity.username,
      password: entity.password,
      isDeleted: entity.isDeleted,
    };
  }
}

export class UsersRepository implements IUsersRepository {
  constructor(private readonly database: Model<UserDocument>, private mapper: IUsersMapper) {}

  async create(user: UserForCreate): Promise<User> {
    const createdUser = await this.database.create(user);

    return this.mapper.fromEntity(createdUser);
  }

  async getAll(query?: QueryParams): Promise<User[]> {
    let users;

    if (query) {
      users = await this.database.find(query);
    } else {
      users = await this.database.find();
    }

    return users.map(this.mapper.fromEntity);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.database.findById(id);

    if (!user) {
      throw Error(`User with ${id} not found`);
    }

    return this.mapper.fromEntity(user);
  }

  async update(id: string, patch: UserForUpdate): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error(`User with ${id} not found`);
    }

    const updated = await this.database.findByIdAndUpdate(id, patch, {
      new: true,
    });

    return this.mapper.fromEntity(updated);
  }

  async delete(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error(`User with ${id} not found`);
    }

    const deleted = await this.database.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    return this.mapper.fromEntity(deleted);
  }
}
