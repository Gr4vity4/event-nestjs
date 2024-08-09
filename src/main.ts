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
    .addTag('Authentications', 'Authentication endpoints')
    .addTag('Events', 'Event management endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
