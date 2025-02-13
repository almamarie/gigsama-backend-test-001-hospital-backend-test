import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  AuthDto,
  ForgotPasswordDto,
  SigninDto,
  UpdatePasswordDto,
  ResetPasswordDto,
} from "./dto";
import { User } from "@prisma/client";
import { GetUser } from "./decorator";
import { JwtGuard } from "./guard";
import { ApiOkResponse } from "@nestjs/swagger";
import { AccessTokenEntity, MessageEntity } from "./entities";
import { GeneralResponseType } from "./types";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("signup/doctor")
  @ApiOkResponse({
    type: AccessTokenEntity,
    isArray: false,
  })
  async signup(@Body() dto: AuthDto): Promise<GeneralResponseType> {
    const accessToken = await this.authService.signup(dto);
    return { status: true, message: "user created", data: accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Patch("signup/activate-account/:token")
  @ApiOkResponse({
    type: MessageEntity,
    isArray: false,
  })
  async activateAccount(
    @Param("token") token: string
  ): Promise<GeneralResponseType> {
    await this.authService.activateAccount(token);
    return { status: true, message: "Account activated.", data: {} };
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  @ApiOkResponse({
    type: AccessTokenEntity,
    isArray: false,
  })
  async signin(@Body() dto: SigninDto): Promise<GeneralResponseType> {
    const accessToken = await this.authService.signin(dto);
    return { status: true, message: "user signed in", data: accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post("forgot-password")
  @ApiOkResponse({
    type: MessageEntity,
    isArray: false,
  })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto
  ): Promise<GeneralResponseType> {
    await this.authService.forgotPassword(dto);
    return {
      status: true,
      message: "Token sent to email!",
      data: {},
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch("reset-password/:token")
  @ApiOkResponse({
    type: MessageEntity,
    isArray: false,
  })
  async resetPassword(
    @Param("token") token: string,
    @Body() dto: ResetPasswordDto
  ): Promise<GeneralResponseType> {
    await this.authService.resetPassword(dto, token);
    return {
      status: true,
      message: "Password reset successful.",
      data: {},
    };
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Patch("update-password")
  @ApiOkResponse({
    type: AccessTokenEntity,
    isArray: false,
  })
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @GetUser() user: User
  ): Promise<GeneralResponseType> {
    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }
    const accessToken = await this.authService.updatePassword(dto, user);
    return { status: true, message: "Password updated.", data: accessToken };
  }
}
