import { Injectable } from '@nestjs/common';
import { IEmailService } from 'src/users/application/adapter/iemail.service';
import { EmailService as ExternalEmailService } from 'src/email/email.service';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private emailService: ExternalEmailService) {}

  async sendMemberJoinVerification(
    email: string,
    signupVerifyToken: string,
  ): Promise<void> {
    this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}
