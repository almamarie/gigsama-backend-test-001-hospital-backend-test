import { ApiProperty } from '@nestjs/swagger';

enum SuccessType {
  success = 'success',
  error = 'error'
}

export class AccessTokenEntity {
  @ApiProperty({
    type: String,
    description: 'The access token'
  })
  access_token: string;
}

export class MessageEntity {
  @ApiProperty({
    enum: SuccessType,
    description: 'A message'
  })
  status: boolean;

  @ApiProperty({
    type: String,
    description: 'A message'
  })
  message: string;
}
