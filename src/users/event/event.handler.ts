import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreateEvent } from './user-create.event';
import { TestEvent } from './test.event';
import { EmailService } from 'src/email/email.service';

@EventsHandler(UserCreateEvent, TestEvent)
export class UserEventsHandler
  implements IEventHandler<UserCreateEvent | TestEvent>
{
  constructor(private emailService: EmailService) {}

  async handle(event: UserCreateEvent | TestEvent) {
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
      case TestEvent.name: {
        console.log('TestEvent!');
        break;
      }
      default:
        break;
    }
  }
}
