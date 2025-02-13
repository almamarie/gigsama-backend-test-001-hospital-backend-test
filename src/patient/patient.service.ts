import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { AssignDto } from './dto/assign.dto';

@Injectable()
export class PatientService {
  private logger = new Logger(PatientService.name);
  constructor(private prismaService: PrismaService) {}

  async getPatientById(userId: string): Promise<User> {
    return await this.prismaService.user.findFirst({ where: { userId } });
  }

  async assignDoctor(dto: { doctorId: string; patientId: string }): Promise<Boolean> {
    this.logger.log('Assigning doctor to user...');
    this.logger.log('Finding doctor...');
    const doctor = await this.prismaService.user.findFirst({ where: { userId: dto.doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    this.logger.log('Checking for similar doctor patient relation...');
    const similarRelation = await this.prismaService.patientDoctor.findFirst({ where: dto });

    if (similarRelation) throw new ForbiddenException('Doctor already assigned to patient');

    this.logger.log('Creating relation.');

    await this.prismaService.patientDoctor.create({ data: dto });
    this.logger.log('done');

    return true;
  }
}
