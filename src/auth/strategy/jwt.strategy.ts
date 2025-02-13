import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { AdminUser, User } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  private logger = new Logger(PassportStrategy.name);
  constructor(
    config: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_SECRET"),
    });
  }
  async validate(payload: { sub: string; email: string; role: string }) {
    console.log("Payload: ", payload);
    this.logger.log("Verifying user");
    let user: User | AdminUser | undefined;

    if (payload.role === "ADMIN" || payload.role === "SUPER_ADMIN") {
      user = await this.prisma.adminUser.findUnique({
        where: { userId: payload.sub },
      });
    } else if (payload.role === "USER") {
      user = await this.prisma.user.findUnique({
        where: { userId: payload.sub },
      });
    } else {
      throw new UnauthorizedException("Unauthorised");
    }

    if (!user) throw new UnauthorizedException("Unauthorised");

    if (!user.accountIsActivated) {
      throw new UnauthorizedException("Account not activated");
    }
    return user;
  }
}
