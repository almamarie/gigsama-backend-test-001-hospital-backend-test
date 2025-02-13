import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";

type ReturnType = { prisma: PrismaService; app: INestApplication };
export const createTestApp = async (port: number): Promise<ReturnType> => {
  let prisma: PrismaService;
  let app: INestApplication;

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.init();

  prisma = app.get(PrismaService);
  await prisma.cleanDb();
  await app.listen(port || 3333);

  return { app, prisma };
};
