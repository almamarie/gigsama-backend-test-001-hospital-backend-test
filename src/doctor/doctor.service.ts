import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PatientDoctor, User } from '@prisma/client';
import { formatUser } from 'src/auth/utils/format-user';
import { FormattedUserType } from 'src/auth/types';
import { SubmitNoteDto } from './dto';

@Injectable()
export class DoctorService {
  private logger = new Logger(DoctorService.name);
  constructor(private prismaService: PrismaService) {}

  async getDoctorsPatients(userId: string): Promise<FormattedUserType[]> {
    const patients = await this.prismaService.patientDoctor.findMany({ where: { doctorId: userId } });
    const patientsIds = patients.map(patient => patient.patientId);
    const patientsData = await this.prismaService.user.findMany({ where: { userId: { in: patientsIds } } });

    return patientsData.map(patient => formatUser(patient));
  }

  async submitNotes(dto: SubmitNoteDto, doctorId: string): Promise<PatientDoctor> {
    this.logger.log('Submitting notes...');

    const relation = await this.prismaService.patientDoctor.findFirst({ where: { id: dto.relationId } });
    console.log('Doctor id: ', doctorId, 'Relation: ', relation);

    if (!relation) throw new NotFoundException('Relation not found');

    if (doctorId !== relation.doctorId) throw new ForbiddenException('You are not allowed to submit notes for this patient');

    const updatedRelation = await this.prismaService.patientDoctor.update({ where: { id: relation.id }, data: { encryptedNotes: dto.note } });

    return updatedRelation;
  }
}
