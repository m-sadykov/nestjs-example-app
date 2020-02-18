export interface AuthenticatedUser {
  readonly username: string;
  readonly roles: string[];
}

export type User = {
  readonly id: string;
  username: string;
  password: string;
  isDeleted: boolean;
};

export type UserForCreate = Omit<User, 'id' | 'isDeleted'>;

export type UserForUpdate = {
  username?: string;
  password?: string;
};
