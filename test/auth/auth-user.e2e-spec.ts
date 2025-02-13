import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthDto } from '../../src/auth/dto';
import { createTestApp } from '../test-utils';
import { TestSignupDto } from '../utils/test.dtos';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const port: number = 3335;

  beforeAll(async () => {
    const testApp = await createTestApp(port);
    app = testApp.app;
    prisma = testApp.prisma;

    pactum.request.setBaseUrl(`http://localhost:${port}`);
    pactum.request.setDefaultTimeout(30000);
  });

  afterAll(async () => {
    app.close();
  });

  describe('User', () => {
    const dto: AuthDto = TestSignupDto;

    describe('DTO check', () => {
      it('Should throw if email empty', () => {
        const dataDto = { ...dto };
        delete dataDto.email;
        return pactum.spec().post('/auth/signup/user').withBody(dataDto).expectStatus(400);
      });
      it('Should throw if password empty', () => {
        const dataDto = { ...dto };
        delete dataDto.password;
        return pactum.spec().post('/auth/signup/user').withBody(dataDto).expectStatus(400);
      });

      it('Should throw if first name empty', () => {
        const dataDto = { ...dto };
        delete dataDto.firstName;
        return pactum.spec().post('/auth/signup/user').withBody(dataDto).expectStatus(400);
      });

      it('Should throw if last name empty', () => {
        const dataDto = { ...dto };
        delete dataDto.lastName;
        return pactum.spec().post('/auth/signup/user').withBody(dataDto).expectStatus(400);
      });

      it('Should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup/user').expectStatus(400);
      });
    });
    describe('Sign up', () => {
      const newDto = { ...dto, email: 'student@example.com' };
      it('Should signup', () => {
        return pactum.spec().post('/auth/signup/user').withBody(newDto).expectStatus(201);
      }, 30000);

      it('Should throw error if duplicate user', () => {
        return pactum.spec().post('/auth/signup/user').withBody(newDto).expectStatus(403);
      });
    });
  });
});
