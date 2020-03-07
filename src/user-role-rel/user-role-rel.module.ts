import { Module, DynamicModule, NestModule, Inject, MiddlewareConsumer } from '@nestjs/common';
import { UserRoleRelController } from './user-role-rel.controller';
import { IUserRoleRelService } from './interfaces/interfaces';
import { USER_ROLE_RELATION_SERVICE, AUTHENTICATE } from '../constants';
import { Authenticate } from '../auth';

@Module({})
export class UserRoleRelModule implements NestModule {
  static forRoot(dependencies: {
    userRoleRelService: IUserRoleRelService;
    authenticate: Authenticate;
  }): DynamicModule {
    return {
      module: UserRoleRelModule,
      controllers: [UserRoleRelController],
      providers: [
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
    consumer.apply(this.authenticate).forRoutes(UserRoleRelController);
  }
}
