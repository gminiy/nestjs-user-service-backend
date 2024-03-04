export interface IEmailService {
  sendMemberJoinVerification: (
    email: string,
    signupVerifyToken: string,
  ) => Promise<void>;
}
