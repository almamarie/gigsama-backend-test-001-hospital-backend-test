import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createTestApp } from '../test-utils';
import { TestSignupDto } from '../utils/test.dtos';
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
      email: 'patient@gmail.com',
      password: 'password'
    };

    describe('signup', () => {
      it('Should signup student', () => {
        return pactum
          .spec()
          .post('/auth/signup/patient')
          .withBody({
            ...TestSignupDto,
            email: 'patient@gmail.com',
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsvHbIl+m2h3SY0UKdhj9\nCPU5nLdTwtkfjQhvzP993oGF9OqXtIqwjEr7SdkReR/47HpPqRQgJJsb4fdydRCd\nBhkyP2T4h7iDALddjoszaJZcta+XV1RZUhgiOxEHyuPhYO2WIF2XpDKEvxY8+vhC\nRutQ31sR7Z5eL9PJwaQ3hNVhHH1UkWWhcHW+7do0v6UzP1IxMgWJ5HPlA389Hgwo\n4pzpabuO6dPEwGufqDkN98jQWBxAazB3AI9lbwxMYDrXG04nT0PvjDsiO76Msjpa\nJgC0eLJkFJsaZWw55kbBcX7mTQjNB5BtNUSF5XvxhVfQj6TiSqOd3LHGQmUZpA8i\nowIDAQAB\n-----END PUBLIC KEY-----',
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
