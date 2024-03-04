import { CqrsEvent } from './cqrs-event';
import { IEvent } from '@nestjs/cqrs';

export class UserCreateEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly email: string,
    readonly signupVerifyToken: string,
  ) {
    super(UserCreateEvent.name);
  }
}
