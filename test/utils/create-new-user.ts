import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

export type CreateTestUserType = {
  dto: {
    email: string;
    firstName: string;
    lastName: string;
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
        role: 'PATIENT',
        passwordHash: await argon.hash(password),
        publicKey: 'your-public-key-here' // Replace with actual public key value
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
