import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    type: String,
    description: 'The email of the user'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
