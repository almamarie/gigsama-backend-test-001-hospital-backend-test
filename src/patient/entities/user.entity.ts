import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'cuid123456'
  })
  userId: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John'
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe'
  })
  lastName: string;

  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'john.doe@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'Role of the user in the system',
    example: 'admin'
  })
  role: string;

  @ApiProperty({
    description: 'Timestamp of when the user was created',
    example: '2024-12-21T10:20:30Z'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp of when the user was last updated',
    example: '2024-12-21T11:20:30Z'
  })
  updatedAt: string;
}
