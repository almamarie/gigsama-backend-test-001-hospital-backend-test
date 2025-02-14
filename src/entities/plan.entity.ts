import { ApiProperty } from '@nestjs/swagger';

export class PlanEntity {
  @ApiProperty({ type: String, description: 'Plan ID' })
  planId: string;

  @ApiProperty({ type: Date, description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Update timestamp' })
  updatedAt: Date;

  @ApiProperty({ type: String, description: 'Patient-Doctor ID (unique)' })
  patientDoctorId: string;
}
