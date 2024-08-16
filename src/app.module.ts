import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SeederModule } from './seeders/seeder.module';
import { AuthModule } from './auth/auth.module';
import { UserSignupModule } from './user-signup/user-signup.module';
import { CacheModule } from '@nestjs/cache-manager';
import { SentryModule } from '@sentry/nestjs/setup';

@Module({
  imports: [
    SentryModule.forRoot(),
    CacheModule.register({
      ttl: 5000, // milliseconds
      max: 100, // maximum number of items in cache
      isGlobal: true,
    }),
    EventModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    SeederModule,
    UserModule,
    AuthModule,
    UserSignupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
