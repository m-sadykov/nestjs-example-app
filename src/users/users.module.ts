import { Module, DynamicModule, Inject, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { IUsersService } from './users.service';
import { IRolesService } from '../roles/';
import { IUserRoleRelService } from '../user-role-rel/user-role-rel.service';
import {
  ROLES_SERVICE,
  USER_ROLE_RELATION_SERVICE,
  USERS_SERVICE,
  AUTHENTICATE,
} from '../constants';
import { Authenticate } from '../auth/auth.middleware';

@Module({})
export class UsersModule implements NestModule {
  static forRoot(dependencies: {
    usersService: IUsersService;
    rolesService: IRolesService;
    userRoleRelService: IUserRoleRelService;
    authenticate: Authenticate;
  }): DynamicModule {
    return {
      module: UsersModule,
      controllers: [UsersController],
      providers: [
        {
          provide: USERS_SERVICE,
          useValue: dependencies.usersService,
        },
        {
          provide: ROLES_SERVICE,
          useValue: dependencies.rolesService,
        },
        {
          provide: USER_ROLE_RELATION_SERVICE,
          useValue: dependencies.userRoleRelService,
        },
        {
          provide: AUTHENTICATE,
          useValue: dependencies.authenticate,
        },
      ],
    };
  }

  constructor(@Inject(AUTHENTICATE) private readonly authenticate: Authenticate) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.authenticate).forRoutes(UsersController);
  }
}
