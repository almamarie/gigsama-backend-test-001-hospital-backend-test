import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SubmitNoteDto {
  @ApiProperty({
    type: String,
    description: "The doctor's note for the patient"
  })
  @IsString()
  @IsNotEmpty()
  note: string;

  @ApiProperty({
    type: String,
    description: 'The id of the patient doctor assignment table'
  })
  @IsString()
  @IsNotEmpty()
  relationId: string;
}
