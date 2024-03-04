import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingMiddleware } from './logging/logging.middleware';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import authConfig from './config/authConfig';
import { WinstonModule, utilities } from 'nest-winston';
import { ExceptionModule } from './exception/exception.module';
import { LoggingModule } from './logging/logging.module';
import { HealthCheckController } from './health-check/health-check.controller';
import * as winston from 'winston';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { DogHealthIndicator } from './health-check/dog-health.indicator';
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    // TypeOrmModule을 동적 모듈로 가지고 온다.
    TypeOrmModule.forRoot({
      type: 'mysql', // 데어터베이스 타입
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 소스 코드 내에서 TypeORM이 구동될 때 인식하도록 할 엔티티 클래스 경로
      synchronize: true, // 마이그레이션 테스트를 위해 변경
      migrationsRun: false, // 서버 구동 시 자동으로 마이그레이션 하지 않도록 설정. cli로만 직접 입력한다.
      migrations: [__dirname + '/**/migrations/*.js'], // 마이그레이션 스크립트 경로
      migrationsTableName: 'migrations', // 마이그레이션 이력 기록되는 테이블 이름
    }),
    AuthModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(), // 로그 시각 표시
            utilities.format.nestLike('MyApp', {
              // 어디에서 로그를 남겼는지 구분하는 appName('MyApp') 설정
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    ExceptionModule,
    LoggingModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthCheckController],
  providers: [DogHealthIndicator],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .exclude({ path: '/users', method: RequestMethod.GET })
      .forRoutes(UsersController);
  }
}
