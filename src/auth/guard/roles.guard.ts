import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { permissions } from "../utils/roles-permissions";
import { User } from "@prisma/client";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger('Roles Guard');

  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    this.logger.log('Checking permissions...');

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const user = context.switchToHttp().getRequest<Request>().user as User;

    await this.updateRemindermarker(user.userId);

    this.checkPermission(user.role, requiredPermissions);
    return true;
  }

  async updateRemindermarker(userId: string) {
    this.logger.log('Updating reminder marker ...');
    this.prismaService.$transaction(async tx => {
      await tx.reminder.updateMany({
        where: { patientId: userId, reminderIsSent: true },
        data: {
          reminderIsSent: false,
          duration: { decrement: 1 }
        }
      });

      await tx.reminder.updateMany({
        where: { patientId: userId, duration: 0 },
        data: {
          isCompleted: true
        }
      });
    });
  }

  checkPermission(payloadRole: string, permission: string[]) {
    this.logger.log('Permission Check called ...');
    console.log({
      'Payload Role: ': payloadRole,
      'Permission: ': permission
    });
    const rolePermissions: string[] | undefined = permissions[payloadRole as keyof typeof permissions];
    if (!rolePermissions) throw new InternalServerErrorException('Role not found.');

    let found = false;
    for (let i = 0; i < permission.length; i++) {
      if (rolePermissions.includes(permission[i])) {
        found = true;
        break;
      }
    }
    if (!found) throw new UnauthorizedException('User not authorised to perform this action');
  }
}
