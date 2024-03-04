import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { AuthGuard } from 'src/auth.guard';
import { UserData } from 'src/util/decorator/userData.decorator';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/create-user.command';
import { VerifyEmailCommand } from './command/verify-email.command';
import { LoginCommand } from './command/login.command';
import { GetUserInfoQuery } from './query/get-user-info.query';

interface User {
  id: string;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  // 회원 가입
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    // this.printWinstonLog(dto);
    const { name, email, password } = dto;
    // await this.userService.createUser(name, email, password);
    const command = new CreateUserCommand(name, email, password);

    return this.commandBus.execute(command);
  }

  // 이메일 인증
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    const command = new VerifyEmailCommand(signupVerifyToken);

    return this.commandBus.execute(command);
  }

  // 로그인
  @Post('login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    const command = new LoginCommand(email, password);

    return this.commandBus.execute(command);
  }

  // 회원 정보 조회
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(
    @UserData() user: User,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);
    return this.queryBus.execute(getUserInfoQuery);
  }

  private printWinstonLog(dto) {
    this.logger.error('error: ', dto);
    this.logger.warn('warn: ', dto);
    this.logger.info('info: ', dto);
    this.logger.http('http: ', dto);
    this.logger.verbose('verbose: ', dto);
    this.logger.debug('debug: ', dto);
    this.logger.silly('silly: ', dto);
  }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ', JSON.stringify(dto));
    this.logger.log('log: ', JSON.stringify(dto));
    this.logger.verbose('verbose: ', JSON.stringify(dto));
    this.logger.debug('debug: ', JSON.stringify(dto));
  }
}
