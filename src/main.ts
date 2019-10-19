import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogginInterceptor } from './logging.insterceptor';
import { Logger, createLogger, transports, format } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger: Logger = createLogger({
    level: 'info',
    format: format.json(),
    defaultMeta: { service: 'app-module' },
    transports: [new transports.Console()],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LogginInterceptor(logger));

  const options = new DocumentBuilder()
    .setTitle('Accounts managing service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Listening on port: ${port}`);
  console.log(`Explore api on http://localhost:${port}/api`);
}
bootstrap();
