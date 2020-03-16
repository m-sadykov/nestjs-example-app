import { UserForCreate, User, UserForUpdate } from './models/user.model';
import { UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { QueryParams, IUsersMapper, IUsersRepository } from './interfaces/interfaces';
import { Either, Left, Right } from 'monet';
import { UserNotFoundError } from './errors/errors';

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

  async findOne(id: string): Promise<Either<UserNotFoundError, User>> {
    const user = await this.database.findById(id);

    if (!user) {
      return Left(new UserNotFoundError(id));
    }
    return Right(this.mapper.fromEntity(user));
  }

  async update(id: string, patch: UserForUpdate): Promise<Either<UserNotFoundError, User>> {
    const eitherGetUser = await this.findOne(id);

    if (eitherGetUser.isLeft()) {
      return eitherGetUser;
    }

    const updated = await this.database.findByIdAndUpdate(id, patch, {
      new: true,
    });
    return Right(this.mapper.fromEntity(updated));
  }

  async delete(id: string): Promise<Either<UserNotFoundError, User>> {
    const eitherGetUser = await this.findOne(id);

    if (eitherGetUser.isLeft()) {
      return eitherGetUser;
    }

    const deleted = await this.database.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return Right(this.mapper.fromEntity(deleted));
  }
}
