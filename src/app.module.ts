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

@Module({
  imports: [
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
