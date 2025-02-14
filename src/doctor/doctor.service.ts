import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Note } from '@prisma/client';
import { formatUser } from 'src/auth/utils/format-user';
import { FormattedUserType } from 'src/auth/types';
import { SubmitNoteDto } from './dto';
import { GeminiService } from 'src/gemini/gemini.service';
import { formatNote } from 'src/utils/format-note';
import { ActionableSteps, FormattedNoteResponse, PlanBaseType, PlanItem, PlanType } from 'types/types';

@Injectable()
export class DoctorService {
  private logger = new Logger(DoctorService.name);
  constructor(
    private prismaService: PrismaService,
    private geminiService: GeminiService
  ) {}

  async getDoctorsPatients(userId: string): Promise<FormattedUserType[]> {
    const patients = await this.prismaService.patientDoctor.findMany({ where: { doctorId: userId } });
    const patientsIds = patients.map(patient => patient.patientId);
    const patientsData = await this.prismaService.user.findMany({ where: { userId: { in: patientsIds } } });

    return patientsData.map(patient => formatUser(patient));
  }

  async submitNotes(dto: SubmitNoteDto, doctorId: string): Promise<FormattedNoteResponse> {
    this.logger.log('Submitting notes...');

    const relation = await this.prismaService.patientDoctor.findFirst({ where: { id: dto.relationId } });
    console.log('Doctor id: ', doctorId, 'Relation: ', relation);

    if (!relation) throw new NotFoundException('Relation not found');

    if (doctorId !== relation.doctorId) throw new ForbiddenException('You are not allowed to submit notes for this patient');

    const actions = await this.extractNotes(dto.note);

    const note = await this.prismaService.$transaction(async tx => {
      const note = await this.prismaService.note.upsert({
        where: { patientDoctorId: relation.id },
        update: { encryptedNote: dto.note, checklist: JSON.stringify(actions.checklist), plan: JSON.stringify(actions.plan) },
        create: { encryptedNote: dto.note, patientId: relation.patientId, doctorId: relation.doctorId, checklist: JSON.stringify(actions.checklist), plan: JSON.stringify(actions.plan), patientDoctorId: relation.id }
      });

      await this.createReminders(actions.plan, note.id, relation.patientId);

      return note;
    });
    return formatNote(note);
  }

  async extractNotes(notes: string): Promise<ActionableSteps> {
    return await this.geminiService.processNotes(notes);
  }

  async createReminders(plans: PlanItem[], noteId: string, patientId: string): Promise<void> {
    console.log('Plan Reminder: ', plans);
    const reminders = plans.map(plan => {
      let planDuration = plan.duration;
      if (plan.frequency === 'TWICE_DAILY') {
        planDuration = planDuration * 2;
      }

      if (plan.frequency === 'THREE_TIMES_DAILY') {
        planDuration = planDuration * 3;
      }

      if (plan.frequency === 'FOUR_TIMES_DAILY') {
        planDuration = planDuration * 4;
      }

      return { message: plan.reminderMessage, frequency: plan.frequency, duration: plan.duration, isCompleted: false, noteId, patientId };
    });

    await this.prismaService.reminder.deleteMany({ where: { noteId } });
    await this.prismaService.reminder.createMany({ data: reminders, skipDuplicates: true });
  }
}
