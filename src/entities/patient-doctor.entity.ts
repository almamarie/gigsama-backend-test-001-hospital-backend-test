import { ApiProperty } from '@nestjs/swagger';
import { PlanEntity } from './plan.entity';

export class PatientDoctorEntity {
  // Use DTO (Data Transfer Object)
  @ApiProperty({ type: String, description: 'Unique identifier' })
  id: string;

  @ApiProperty({ type: Date, description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Update timestamp' })
  updatedAt: Date;

  @ApiProperty({ type: String, description: 'Patient ID' })
  patientId: string;

  @ApiProperty({ type: String, description: 'Doctor ID' })
  doctorId: string;

  @ApiProperty({ type: String, description: 'Encrypted notes' })
  notes: string | null;

  @ApiProperty({ type: String, description: 'Checklist' })
  checkList: string | null;

  @ApiProperty({ type: PlanEntity, description: 'Plan' }) // Use Plan DTO
  plan: PlanEntity | null;

  @ApiProperty({ type: String, description: 'Plan ID (optional, unique)' })
  planId: string | null;
}
