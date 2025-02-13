import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AssignDto {
  @ApiProperty({
    type: String,
    description: 'The id of the doctor'
  })
  @IsString()
  @IsNotEmpty()
  doctorId: string;
}
