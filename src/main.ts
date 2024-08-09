import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserSeederService } from './seeders/user-seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const seeder = app.get(UserSeederService);
  await seeder.seed();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(3000);
}
bootstrap();
