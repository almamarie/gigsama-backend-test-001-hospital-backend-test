import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {    
      @ApiProperty({
        type: String,
        description: "The new password of the user",
      })
      @IsString()
      @IsNotEmpty()
      newPassword: string;
    
      @ApiProperty({
        type: String,
        description: "Comfirm password, must be same as new password",
      })
      @IsString()
      @IsNotEmpty()
      confirmPassword: string;
}
