import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Reminder, ReminderFrequency } from '@prisma/client';
import { EmailService } from 'src/email/email.service';
import { SendEmailType } from 'src/email/types/types';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';
interface IReminder {
  patientEmail: string;
  message: string;
  duration: number;
  firstName: string;
}

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService
  ) {
    this.logger.log('Setting up reminder cron');

    // this.logger.log('Generating Public private keys');
    // // Generate keys for patient and doctor
    // const patientKeys = this.generateKeyPair();
    // const doctorKeys = this.generateKeyPair();
  }

  @Cron('0 6,12,18,22 * * *')
  async handleCron() {
    this.logger.log('Sending reminders cron started');
    const now = new Date();
    const hour = now.getHours();

    const frequenciesToFetch: ReminderFrequency[] = this.getFrequenciesToFetch(hour);

    const reminders: IReminder[] = await this.getReminders(frequenciesToFetch);

    await this.sendReminders(reminders);
  }

  getFrequenciesToFetch(hour: number): ReminderFrequency[] {
    switch (hour) {
      case 6:
        return ['ONCE_DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY'];
      case 12:
        return ['THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY'];
      case 18:
        return ['TWICE_DAILY', 'THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY'];
      case 22:
        return ['FOUR_TIMES_DAILY'];
      default:
        console.log('Not a scheduled reminder time.');
        return [];
    }
  }

  async getReminders(frequenciesToFetch: ReminderFrequency[]): Promise<IReminder[]> {
    this.logger.log('Retrieving reminders...');
    const reminders = await this.prismaService.reminder.findMany({ where: { frequency: { in: frequenciesToFetch }, duration: { gt: 0 } }, include: { patient: true } });
    return reminders.map(reminder => {
      return { firstName: reminder.patient.firstName, patientEmail: reminder.patient.email, message: reminder.message, duration: reminder.duration };
    });
  }

  async updateSendMarker(reminderIds: string[]) {
    this.prismaService.reminder.updateMany({ where: { reminderId: { in: reminderIds } }, data: { reminderIsSent: true } });
  }

  async sendReminders(reminders: IReminder[]) {
    this.logger.log('Sending reminders...');
    reminders.map(reminder => {
      console.log(reminder.message);
    });

    this.sendReminderEmails(reminders);
  }

  async sendReminderEmails(reminders: IReminder[]) {
    const parsedEmailData = reminders.map(reminder => {
      return {
        to: reminder.patientEmail,
        subject: 'Reminder',
        template: './reminder',
        context: { ...reminder }
      } as SendEmailType;
    });
    parsedEmailData.forEach(data => this.emailService.sendMail(data));
  }

  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048, // Strong encryption
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    console.log('Patient Public Key:\n', publicKey);

    return { publicKey, privateKey };
  }
}
