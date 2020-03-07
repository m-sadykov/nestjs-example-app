import { Module, DynamicModule, NestModule, MiddlewareConsumer, Inject } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { IRolesService } from './interfaces/interfaces';
import { ROLES_SERVICE, AUTHENTICATE } from '../constants';
import { Authenticate } from '../auth';

@Module({})
export class RolesModule implements NestModule {
  static forRoot(dependencies: {
    rolesService: IRolesService;
    authenticate: Authenticate;
  }): DynamicModule {
    return {
      module: RolesModule,
      controllers: [RolesController],
      providers: [
        {
          provide: ROLES_SERVICE,
          useValue: dependencies.rolesService,
        },
        {
          provide: AUTHENTICATE,
          useValue: dependencies.authenticate,
        },
      ],
    };
  }

  constructor(@Inject('AUTHENTICATE') private readonly authenticate: Authenticate) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.authenticate).forRoutes(RolesController);
  }
}
