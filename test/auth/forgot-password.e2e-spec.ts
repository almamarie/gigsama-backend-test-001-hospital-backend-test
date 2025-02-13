import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createTestApp } from '../test-utils';
import { TestSignupDto } from '../utils/test.dtos';
import { AuthDto, ForgotPasswordDto } from 'src/auth/dto';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const port: number = 3338;
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

  describe('Forgot password', () => {
    it('should create a new user', () => {
      const dto: AuthDto = { ...TestSignupDto, email: 'mloumar82@gmail.com' };

      return pactum.spec().post('/auth/signup/user').withBody(dto).expectStatus(201);
    });
    describe('Send password reset link', () => {
      const dto: ForgotPasswordDto = {
        email: 'mloumar82@gmail.com',
        resetUrl: 'http://localhost:3000/auth/reset-password'
      };
      it('should throw error when restUrl is not given', () => {
        return pactum
          .spec()
          .post('/auth/forgot-password')
          .withBody({ ...dto, resetUrl: undefined })
          .expectStatus(400);
      });
      it('should throw error when email is not given', () => {
        return pactum
          .spec()
          .post('/auth/forgot-password')
          .withBody({ ...dto, email: undefined })
          .expectStatus(400);
      });

      it('should send password reset email', () => {
        return pactum
          .spec()
          .post('/auth/forgot-password')
          .withBody({ ...dto })
          .expectStatus(200);
      });
    });
  });
});
