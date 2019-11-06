import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './logging.interceptor';
import { Logger, createLogger, transports, format } from 'winston';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger: Logger = createLogger({
    level: 'info',
    format: format.json(),
    defaultMeta: { service: 'app-module' },
    transports: [new transports.Console()],
  });

  const reflector = new Reflector();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard(reflector));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const options = new DocumentBuilder()
    .setTitle('Nest.js example app')
    .setDescription(
      'User auto generated admin user credentials to authenticate into swagger',
    )
    .setVersion('1.0')
    .addBearerAuth('Authorization', 'header', 'basic')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Listening on port: ${port}`);
  console.log(`Explore api on http://localhost:${port}/api`);
}
bootstrap();
