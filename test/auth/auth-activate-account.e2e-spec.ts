import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createTestApp } from '../test-utils';
import { SigninDto } from 'src/auth/dto';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let port: number = 3334;
  beforeAll(async () => {
    const testApp = await createTestApp(port);
    app = testApp.app;
    prisma = testApp.prisma;

    pactum.request.setBaseUrl(`http://localhost:${port}`);
    pactum.request.setDefaultTimeout(30000);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Sign in', () => {
    const dto: SigninDto = {
      email: 'signin-test@gmail.com',
      password: 'password'
    };

    it.todo('Should activate account not implemented');
  });
});
