import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserSeederService } from './seeders/user-seeder.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { corsOptions } from './cors.config';

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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors(corsOptions);
  await app.listen(3000);
}
bootstrap();
