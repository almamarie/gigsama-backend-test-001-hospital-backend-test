import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PatientDoctor, User } from '@prisma/client';

@Injectable()
export class PatientService {
  private logger = new Logger(PatientService.name);
  constructor(private prismaService: PrismaService) {}

  async getPatientById(userId: string): Promise<User> {
    return await this.prismaService.user.findFirst({ where: { userId } });
  }

  async assignDoctor(dto: { doctorId: string; patientId: string }): Promise<PatientDoctor> {
    this.logger.log('Assigning doctor to user...');
    this.logger.log('Finding doctor...');
    const doctor = await this.prismaService.user.findFirst({ where: { userId: dto.doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    this.logger.log('Checking for similar doctor patient relation...');
    const similarRelation = await this.prismaService.patientDoctor.findFirst({ where: dto });

    if (similarRelation) throw new ForbiddenException('Doctor already assigned to patient');

    this.logger.log('Creating relation.');

    const relation = await this.prismaService.patientDoctor.create({ data: dto });
    this.logger.log('done');
    return relation;
  }

  async retrieveRelationActionsReminders(relationId: string, patientId: string) {
    this.logger.log('Retrieveing actions and reminders');

    const note = await this.prismaService.note.findFirst({ where: { patientDoctorId: relationId, patientId }, include: { reminders: true } });
    if (!note) throw new NotFoundException('Not found');

    return {
      checklist: JSON.parse(note.checklist),
      plan: JSON.parse(note.plan),
      reminders: note.reminders
    };
  }
}
