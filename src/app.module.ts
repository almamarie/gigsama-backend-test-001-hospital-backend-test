import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { LoggerMiddleware } from "./utils/logger.middleware";
import { EmailModule } from "./email/email.module";
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { GeminiModule } from './gemini/gemini.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderService } from './reminders/reminders.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(), EmailModule, AuthModule, PatientModule, DoctorModule, GeminiModule, PrismaModule],
  providers: [ReminderService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
