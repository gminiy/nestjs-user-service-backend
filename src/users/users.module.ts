import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './command/create-user.handler';
import { VerifyEmailHandler } from './command/verify-email.handler';
import { LoginHandler } from './command/login.handler';
import { UsersService } from './users.service';
import { UserEventsHandler } from './event/event.handler';
import { GetUserInfoQueryHandler } from './query/get-user-info-query.handler';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    VerifyEmailHandler,
    LoginHandler,
    UsersService,
    UserEventsHandler,
    GetUserInfoQueryHandler,
  ],
})
export class UsersModule {}
