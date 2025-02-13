import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

export type CreateTestUserType = {
  dto: {
    email: string;
    firstName: string;
    lastName: string;
    otherNames: string;
  };
  password: string;
  prisma: PrismaService;
};

export const createTestUser = async (data: CreateTestUserType) => {
  let { dto, password, prisma } = data;

  try {
    await prisma.user.create({
      data: {
        ...dto,
        accountIsActivated: true,
        role: 'USER',
        passwordHash: await argon.hash(password)
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
