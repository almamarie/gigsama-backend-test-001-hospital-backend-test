import { Body, Controller, Get, Patch, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { formatUser } from '../auth/utils/format-user';
import { ApiOkResponse } from '@nestjs/swagger';
import { MessageEntity } from 'src/auth/entities';
import { DoctorService } from './doctor.service';
import { FormattedUserType } from 'src/auth/types';
import { GeneralResponseEntity } from 'src/utils/entity';
import { SubmitNoteDto } from './dto';
import { FormattedNoteResponse } from 'types/types';

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
  @ApiOkResponse({
    type: GeneralResponseEntity<FormattedUserType[]>,
    isArray: true
  })
  @SetMetadata('permissions', ['get:doctor:patients'])
  async getDoctorsPatients(@GetUser('userId') userId: string) {
    const users = await this.doctorService.getDoctorsPatients(userId);
    return { status: true, message: 'Patients retrieved successfully.', data: users };
  }

  @Patch('notes')
  @ApiOkResponse({
    type: GeneralResponseEntity<FormattedNoteResponse>,
    isArray: true
  })
  @SetMetadata('permissions', ['post:patient:notes'])
  async submitPatientNotes(@GetUser() doctor: User, @Body() dto: SubmitNoteDto) {
    const note = await this.doctorService.submitNotes(dto, doctor);
    return { status: true, message: 'Note submitted.', data: note };
  }
}
