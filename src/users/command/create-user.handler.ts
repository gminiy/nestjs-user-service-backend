import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import * as uuid from 'uuid';
import { UserCreateEvent } from '../event/user-create.event';
import { TestEvent } from '../event/test.event';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }
    const signupVerifyToken = uuid.v1();
    await this.saveUserUsingTransaction(
      name,
      email,
      password,
      signupVerifyToken,
    );

    this.eventBus.publish(new UserCreateEvent(email, signupVerifyToken));
    this.eventBus.publish(new TestEvent());
    // await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user != undefined; // TODO: DB 연동 후 구현
  }
  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = uuid.v1();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}
