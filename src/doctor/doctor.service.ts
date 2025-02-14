import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { ReminderFrequency } from 'types/types';
import { formatUser } from 'src/auth/utils/format-user';
import { SubmitNoteDto } from './dto';
import { GeminiService } from 'src/gemini/gemini.service';
import { formatNote } from 'src/utils/format-note';
import { ActionableSteps, FormattedNoteResponse, PlanBaseType, PlanItem, PlanType } from 'types/types';
import * as crypto from 'crypto';
import { FormattedUserType } from 'types';

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

  async submitNotes(dto: SubmitNoteDto, doctor: User): Promise<FormattedNoteResponse> {
    this.logger.log('Submitting notes...');

    const relation = await this.prismaService.patientDoctor.findFirst({ where: { id: dto.relationId } });
    console.log('Doctor id: ', doctor.userId, 'Relation: ', relation);

    if (!relation) throw new NotFoundException('Relation not found');

    const patient = await this.prismaService.user.findFirst({ where: { userId: relation.patientId } });

    if (doctor.userId !== relation.doctorId || patient.userId !== relation.patientId) throw new ForbiddenException('You are not allowed to submit notes for this patient');

    const actions = await this.extractNotes(dto.note);

    const { encryptedNote, encryptedAESKeyForPatient, encryptedAESKeyForDoctor, iv } = await this.encryptNote(dto.note, patient.publicKey, doctor.publicKey);
    const note = await this.prismaService.$transaction(async tx => {
      const note = await tx.note.upsert({
        where: { patientDoctorId: relation.id },
        update: { encryptedNote, encryptedAESKeyForPatient, encryptedAESKeyForDoctor, iv, checklist: JSON.stringify(actions.checklist), plan: JSON.stringify(actions.plan) },
        create: { encryptedNote, encryptedAESKeyForPatient, encryptedAESKeyForDoctor, iv, patientId: relation.patientId, doctorId: relation.doctorId, checklist: JSON.stringify(actions.checklist), plan: JSON.stringify(actions.plan), patientDoctorId: relation.id }
      });

      await this.createReminders(actions.plan, note.id, relation.patientId, tx);

      return note;
    });
    return formatNote(note);
  }

  async extractNotes(notes: string): Promise<ActionableSteps> {
    return await this.geminiService.processNotes(notes);
  }

  async createReminders(plans: PlanItem[], noteId: string, patientId: string, tx: Prisma.TransactionClient): Promise<void> {
    console.log('Plan Reminder: ', plans);
    const reminders = plans.map(plan => {
      if (!Object.values(ReminderFrequency).includes(plan.frequency)) {
        plan.frequency = ReminderFrequency.ONCE_DAILY as ReminderFrequency;
      }

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

    await tx.reminder.deleteMany({ where: { noteId } });
    await tx.reminder.createMany({ data: reminders, skipDuplicates: true });
  }

  async encryptNote(note: string, patientPublicKey: string, doctorPublicKey: string): Promise<{ encryptedNote: string; encryptedAESKeyForPatient: string; encryptedAESKeyForDoctor: string; iv: string }> {
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let encryptedNote = cipher.update(note, 'utf-8', 'base64');
    encryptedNote += cipher.final('base64');

    const encryptedAESKeyForPatient = crypto.publicEncrypt({ key: patientPublicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, aesKey).toString('base64');

    const encryptedAESKeyForDoctor = crypto.publicEncrypt({ key: doctorPublicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, aesKey).toString('base64');

    return {
      encryptedNote,
      encryptedAESKeyForPatient,
      encryptedAESKeyForDoctor,
      iv: iv.toString('base64')
    };
  }
}
