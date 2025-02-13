import { AuthDto, SigninDto } from '../../src/auth/dto';

export const TestSignupDto: AuthDto = {
  email: 'alouismariea97@gmail.com',
  password: 'password',
  firstName: 'Henry',
  lastName: 'Newman',
  otherNames: '',
  frontendBaseUrl: 'http://localhost:3000/activate-account'
};

export const TestSigninDto: SigninDto = {
  email: 'test@email.com',
  password: 'password',
};
