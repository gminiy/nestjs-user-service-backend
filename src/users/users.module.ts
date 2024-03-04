import { Module } from '@nestjs/common';
import { UsersController } from './interface/users.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/db/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './application/command/create-user.handler';
import { VerifyEmailHandler } from './application/command/verify-email.handler';
import { LoginHandler } from './application/command/login.handler';
import { UsersService } from './users.service';
import { UserEventsHandler } from './application/event/user-event.handler';
import { GetUserInfoQueryHandler } from './application/query/get-user-info-query.handler';
import { UserFactory } from './domain/user.factory';
import { UserRepository } from './infra/db/repository/user.repository';
import { EmailService } from 'src/email/email.service';

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
    UserFactory,
    { provide: 'UserRepository', useClass: UserRepository },
    { provide: 'EmailService', useClass: EmailService },
  ],
})
export class UsersModule {}
