import { EventBus } from '@nestjs/cqrs';
import { UserCreateEvent } from './user-create.event';
import { User } from './user';

export class UserFactory {
  constructor(private eventBus: EventBus) {}

  create(
    id: string,
    name: string,
    email: string,
    signupVarificationToken: string,
    password: string,
  ) {
    const user = new User(id, name, email, password, signupVarificationToken);
    this.eventBus.publish(new UserCreateEvent(email, signupVarificationToken));
    return user;
  }

  reconstitute(
    id: string,
    name: string,
    email: string,
    signupVarificationToken: string,
    password: string,
  ) {
    return new User(id, name, email, password, signupVarificationToken);
  }
}
