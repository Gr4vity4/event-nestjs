import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserSeederService } from './seeders/user-seeder.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app: any = await NestFactory.create(AppModule);

  const seeder = app.get(UserSeederService);
  await seeder.seed();

  const config = new DocumentBuilder()
    .setTitle('Event management')
    .setDescription('The event management API description')
    .setVersion('1.0')
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('Event', 'Event endpoints')
    .addTag(
      'User Signup',
      'This API allows users to register their interest in events.',
    )
    .addServer('/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(3000);
}
bootstrap();
