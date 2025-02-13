import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { EditUserDto } from 'src/user/dto';
import { createTestApp } from '../test-utils';
import { TestSigninDto, TestSignupDto } from '../utils/test.dtos';
import { SigninDto } from 'src/auth/dto';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let port: number = 3337;
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

    describe('signup', () => {
      it('Should signup student', () => {
        return pactum
          .spec()
          .post('/auth/signup/user')
          .withBody({
            ...TestSignupDto,
            email: 'signin-test@gmail.com',
            password: 'password'
          })
          .expectStatus(201);
      }, 30000);
    });

    describe('DTO check', () => {
      it('Should throw if email empty', () => {
        return pactum.spec().post('/auth/signin').withBody({ password: dto.password }).expectStatus(400);
      });

      it('Should throw if password empty', () => {
        return pactum.spec().post('/auth/signin').withBody({ email: dto.email }).expectStatus(400);
      });
      it('Should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
    });

    describe('signin', () => {
      it('Should throw if duplicate email', () => {
        return pactum.spec().post('/auth/signin').withBody({ email: dto.email }).expectStatus(400);
      });

      it('Should throw if password is wrong', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ ...dto, password: 'jshshdsnbfd' })
          .expectStatus(403);
      });

      it('Should signin', () => {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).expectBodyContains('token').stores('userAt', 'access_token');
      });
    });
  });
});
