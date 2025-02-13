import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private logger = new Logger(PassportStrategy.name);
  constructor(
    config: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET')
    });
  }
  async validate(payload: { sub: string; email: string; role: string }) {
    this.logger.log('Verifying user');
    let user: User | undefined;

    user = await this.prisma.user.findUnique({
      where: { userId: payload.sub }
    });

    if (!user) throw new UnauthorizedException('Unauthorised');

    return user;
  }
}
