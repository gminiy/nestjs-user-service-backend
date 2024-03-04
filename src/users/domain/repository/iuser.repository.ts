import { User } from '../user';

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User | null>;
  save: (
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) => Promise<void>;
}
