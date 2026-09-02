import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AreasModule } from './areas/areas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.getOrThrow<string>('DB_HOST'),

        port: configService.getOrThrow<number>('DB_PORT'),

        username: configService.getOrThrow<string>('DB_USERNAME'),

        password: configService.getOrThrow<string>('DB_PASSWORD'),

        database: configService.getOrThrow<string>('DB_DATABASE'),

        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    AreasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
