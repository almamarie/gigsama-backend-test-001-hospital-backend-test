import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SigninDto {
  @ApiProperty({
    type: String,
    description: "The email of the user",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: "The password of the user",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
