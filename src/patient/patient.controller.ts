import { Body, Controller, Get, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { formatUser } from '../auth/utils/format-user';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserEntity } from './entities';
import { PatientService } from './patient.service';
import { MessageEntity } from 'src/auth/entities';
import { AssignDto } from './dto/assign.dto';

@Controller('patients')
@UseGuards(JwtGuard, RolesGuard)
export class PatientController {
  constructor(private patientService: PatientService) {}
  @Get('me')
  @ApiCreatedResponse({
    type: UserEntity,
    isArray: false
  })
  @SetMetadata('permissions', ['get:own:user'])
  getMe(@GetUser() user: User) {
    return formatUser(user);
  }

  @Post('assign-doctor')
  @ApiOkResponse({
    type: MessageEntity,
    isArray: false
  })
  @SetMetadata('permissions', ['post:assign:doctor'])
  async assignDoctor(@GetUser('userId') userId: string, @Body() dto: AssignDto) {
    await this.patientService.assignDoctor({ ...dto, patientId: userId });
    return { status: true, message: 'Doctor assigned to patient successfully.', data: {} };
  }
}
