import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { EditUserDto } from 'src/user/dto';
import { createTestApp } from '../test-utils';
import { TestSignupDto } from '../utils/test.dtos';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const port: number = 3336;
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

  describe('User', () => {
    it('should sign up', () => {
      const dto = { ...TestSignupDto, email: 'user-test@example.com' };
      return pactum.spec().post('/auth/signup/user').withBody(dto).expectStatus(201).expectBodyContains('access_token').stores('userAccessToken', 'access_token');
      // .inspect();
    }, 30000);
    describe('Get me', () => {
      it('should get a user with given token', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .stores('userId', 'id');
      });
      it('should throw if token is wrong', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200);
      });
    });
    describe('Edit user by id', () => {
      const dto: EditUserDto = { firstName: 'alma', lastName: 'Marie' };
      it('should edit user with a given id', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectStatus(200);
      });

      it('should ensure edited details are persisted', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withBody({ ...dto, firstName: 'Alma' })
          .expectStatus(200)
          .expectJson('firstName', 'Alma');
      });
    });
  });
});
