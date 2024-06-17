import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { FAQModule } from './faq/faq.module';
import { DirectionModule } from './direction/direction.module';
import { WeatherModule } from './weather/weather.module';
import { AttractionModule } from './attraction/attraction.module';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';
import { CronModule } from './cron/cron.module';
import { ImageModule } from './image/image.module';
import { MetaModule } from './meta/meta.module';
import { CameraModule } from './camera/camera.module';
import { UserEntity } from './user/user.entity';
import { AnswerEntity } from './faq/faq.entity';
import { QuestionEntity } from './faq/faq.entity';
import { DirectionEntity } from './direction/direction.entity';
import { WeatherEntity } from './weather/weather.entity';
import { ContentEntity } from './content/content.entity';
import { SEOEntity } from './blog/blog.entity';
import { BlogEntity } from './blog/blog.entity';
import { ImageEntity } from './image/image.entity';
import { MetaEntity } from './meta/meta.entity';
import { CameraEntity } from './camera/camera.entity';
import configuration from './config/configuration';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", 'upload')
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration]
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        UserEntity,
        AnswerEntity,
        QuestionEntity,
        DirectionEntity,
        WeatherEntity,
        ContentEntity,
        BlogEntity,
        SEOEntity,
        ImageEntity,
        MetaEntity,
        CameraEntity
      ],
      synchronize: true,
      autoLoadEntities: true
    }),
    ScheduleModule.forRoot(),
    CronModule,
    UserModule,
    FAQModule,
    WeatherModule,
    DirectionModule,
    AttractionModule,
    BlogModule,
    AuthModule,
    ImageModule,
    MetaModule,
    CameraModule
  ],
  controllers: [AppController],
  providers: [],
})

export class AppModule { }
