import { ApiProperty } from '@nestjs/swagger';

export class GeneralResponseEntity<T = {}> {
  @ApiProperty({
    type: Boolean,
    description: 'The status of the response'
  })
  status: boolean;

  @ApiProperty({
    type: String,
    description: 'A brief message about the response'
  })
  message: string;

  @ApiProperty({
    type: Object,
    description: 'The data returned by the response'
  })
  data: T;
}
