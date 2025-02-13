import { MailerService } from "@nestjs-modules/mailer";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendEmailType } from "./types/types";

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private config: ConfigService
  ) {}

  async sendMail(data: SendEmailType) {
    this.logger.log(`Sending email to ${data.to}...`);
    try {
      await this.mailerService.sendMail({
        to: data.to,
        // from: data.from,
        subject: data.subject,
        template: data.template,
        context: data.context,
      });
      this.logger.log(`Done sending email to ${data.to}.`);

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
