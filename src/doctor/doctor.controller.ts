import { Body, Controller, Get, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { PatientDoctor, User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { formatUser } from '../auth/utils/format-user';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { MessageEntity } from 'src/auth/entities';
import { UserEntity } from 'src/user/entities';
import { DoctorService } from './doctor.service';
import { FormattedUserType } from 'src/auth/types';
import { GeneralResponseEntity } from 'src/utils/entity';
import { SubmitNoteDto } from './dto';

@Controller('doctors')
@UseGuards(JwtGuard, RolesGuard)
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get('me')
  @ApiOkResponse({
    type: MessageEntity,
    isArray: false
  })
  @SetMetadata('permissions', ['get:own:user', 'pairer:user'])
  getMe(@GetUser() user: User) {
    return {
      status: true,
      message: 'User retrieved',
      data: formatUser(user)
    };
  }

  @Get('patients')
  @ApiCreatedResponse({
    type: GeneralResponseEntity<FormattedUserType[]>,
    isArray: true
  })
  @SetMetadata('permissions', ['get:doctor:patients'])
  async getDoctorsPatients(@GetUser('userId') userId: string) {
    const users = await this.doctorService.getDoctorsPatients(userId);
    return { status: true, message: 'Patients retrieved successfully.', data: users };
  }

  @Post('notes')
  @ApiCreatedResponse({
    type: GeneralResponseEntity<PatientDoctor>,
    isArray: true
  })
  @SetMetadata('permissions', ['post:patient:notes'])
  async submitPatientNotes(@GetUser('userId') doctorId: string, @Body() dto: SubmitNoteDto) {
    const note = await this.doctorService.submitNotes(dto, doctorId);
    return { status: true, message: 'Note submitted.', data: note };
  }
}
