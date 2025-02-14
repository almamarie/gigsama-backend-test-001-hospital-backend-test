import { Body, Controller, Get, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { formatUser } from '../auth/utils/format-user';
import { ApiOkResponse } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { MessageEntity } from 'src/auth/entities';
import { AssignDto } from './dto/assign.dto';
import { GeneralResponseEntity } from 'src/utils/entity';
import { PatientDoctorEntity } from 'src/entities';
import { GetActionDto } from './dto/get-actions.dto';

@Controller('patients')
@UseGuards(JwtGuard, RolesGuard)
export class PatientController {
  constructor(private patientService: PatientService) {}
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

  @Post('assign-doctor')
  @ApiOkResponse({
    type: GeneralResponseEntity<PatientDoctorEntity>,
    isArray: false
  })
  @SetMetadata('permissions', ['post:assign:doctor'])
  async assignDoctor(@GetUser('userId') userId: string, @Body() dto: AssignDto) {
    const relation = await this.patientService.assignDoctor({ ...dto, patientId: userId });
    return { status: true, message: 'Doctor assigned to patient successfully.', data: { relation } };
  }

  @Get('actions-reminders')
  @ApiOkResponse({
    type: GeneralResponseEntity<PatientDoctorEntity>,
    isArray: false
  })
  @SetMetadata('permissions', ['get:note:patient'])
  async getActions(@GetUser('userId') userId: string, @Body() dto: GetActionDto) {
    const relation = await this.patientService.retrieveRelationActionsReminders(dto.relationId, userId);
    return { status: true, message: 'Actions and reminders retrieved successfully.', data: { relation } };
  }
}
