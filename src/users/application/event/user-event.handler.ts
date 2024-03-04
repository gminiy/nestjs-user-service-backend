import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreateEvent } from '../../domain/user-create.event';
import { Inject } from '@nestjs/common';
import { IEmailService } from '../adapter/iemail.service';

@EventsHandler(UserCreateEvent)
export class UserEventsHandler implements IEventHandler<UserCreateEvent> {
  constructor(@Inject('EmailService') private emailService: IEmailService) {}

  async handle(event: UserCreateEvent) {
    switch (event.name) {
      case UserCreateEvent.name: {
        console.log('UserCreatedEvent!');
        const { email, signupVerifyToken } = event as UserCreateEvent;
        await this.emailService.sendMemberJoinVerification(
          email,
          signupVerifyToken,
        );
        break;
      }
      default:
        break;
    }
  }
}
