import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prismaService.user.update({
      where: { userId: userId },
      data: { ...dto }
    });
    return user;
  }

  async getUserById(userId: string): Promise<User> {
    return await this.prismaService.user.findFirst({ where: { userId } });
  }

  async deleteUserById(userId: string) {
    return await this.prismaService.user.delete({ where: { userId } });
  }
}
