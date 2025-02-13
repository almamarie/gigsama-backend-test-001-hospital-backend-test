import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UpdatePasswordDto } from 'src/auth/dto';
import { createTestApp } from '../../test/test-utils';
import { TestSignupDto } from '../../test/utils';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const port: number = 3339;
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

  describe('Update password', () => {
    const dto: UpdatePasswordDto = {
      currentPassword: TestSignupDto.password,
      newPassword: 'new password',
      confirmPassword: 'new password'
    };
    it('should create a new user', () => {
      return pactum
        .spec()
        .post('/auth/signup/user')
        .withBody({
          ...TestSignupDto,
          email: 'update-password@gmail.com'
        })
        .expectStatus(201)
        .stores('userAccessToken', 'access_token');
    });
    describe('DTO Check', () => {
      it('should throw when current password not in dto', () => {
        const data: UpdatePasswordDto = { ...dto, currentPassword: undefined };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .put('/auth/update-password')
          .withBody(data)
          .expectStatus(400);
      });

      it('should throw when new password not in dto', () => {
        const data: UpdatePasswordDto = {
          ...dto,
          newPassword: undefined
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .put('/auth/update-password')
          .withBody(data)
          .expectStatus(400);
      });

      it('should throw when confirm password not in dto', () => {
        const data: UpdatePasswordDto = {
          ...dto,
          confirmPassword: undefined
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .put('/auth/update-password')
          .withBody(data)
          .expectStatus(400);
      });

      it('should throw when new password not equal to confirm password', () => {
        const data: UpdatePasswordDto = {
          ...dto,
          newPassword: 'incorrect password'
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .put('/auth/update-password')
          .withBody(data)
          .expectStatus(400);
      });
    });

    describe('authorization header check', () => {
      it('should throw when authorization header is incorrect', () => {
        const data: UpdatePasswordDto = {
          ...dto,
          currentPassword: undefined
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer incorrectAccessToken'
          })
          .put('/auth/update-password')
          .withBody(data)
          .expectStatus(401);
      });

      it('should update password', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .put('/auth/update-password')
          .withBody(dto)
          .expectStatus(200);
      });

      it('should sign in with new password', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'update-password@gmail.com',
            password: dto.newPassword
          })
          .expectStatus(200);
      });
    });
  });
});
