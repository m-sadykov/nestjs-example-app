import { DynamicModule, Module } from '@nestjs/common';
import { Authenticate } from './auth';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { IRolesService, RolesModule } from './roles';
import { IUserRoleRelService, UserRoleRelModule } from './user-role-rel';
import { IUsersService, UsersModule } from './users';

@Module({})
export class AppModule {
  static async forRoot(dependencies: {
    usersService: IUsersService;
    rolesService: IRolesService;
    userRoleRelService: IUserRoleRelService;
    authenticate: Authenticate;
  }): Promise<DynamicModule> {
    return {
      module: AppModule,
      imports: [
        ConfigModule,
        DatabaseModule,
        RolesModule.forRoot(dependencies),
        UsersModule.forRoot(dependencies),
        UserRoleRelModule.forRoot(dependencies),
      ],
    };
  }
}
