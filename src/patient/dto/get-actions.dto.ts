import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetActionDto {
  @ApiProperty({
    type: String,
    description: 'The id of the relation'
  })
  @IsString()
  @IsNotEmpty()
  relationId: string;
}
