import { UserForCreate, User, UserForUpdate, AuthenticatedUser } from '../models/user.model';
import { Either } from 'monet';
import { UserNotFoundError, UserAlreadyExistsError } from '../errors/errors';
import { RoleRelationNotFoundError } from '../../user-role-rel';
import { RoleNotFoundError } from '../../roles';

export type QueryParams = {
  username?: string;
  password?: string;
  isDeleted?: boolean;
};

export interface IUsersRepository {
  create(user: UserForCreate): Promise<User>;

  getAll(query?: QueryParams): Promise<User[]>;

  findOne(id: string): Promise<Either<UserNotFoundError, User>>;

  update(id: string, patch: UserForUpdate): Promise<Either<UserNotFoundError, User>>;

  delete(id: string): Promise<Either<UserNotFoundError, User>>;
}

export interface IUsersMapper {
  fromEntity(entity: any): User;
}

export interface IUsersService {
  getUserCredentials(
    username: string,
    password: string,
  ): Promise<Either<RoleRelationNotFoundError | RoleNotFoundError, AuthenticatedUser>>;

  getAll(query?: QueryParams): Promise<User[]>;

  findOne(id: string): Promise<Either<UserNotFoundError, User>>;

  addUser(user: UserForCreate): Promise<Either<UserAlreadyExistsError, User>>;
  updateUser(id: string, patch: UserForUpdate): Promise<Either<UserNotFoundError, User>>;
  removeUser(id: string): Promise<Either<UserNotFoundError, User>>;
}
