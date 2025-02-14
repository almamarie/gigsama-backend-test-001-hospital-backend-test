import { AuthDto, SigninDto } from '../../src/auth/dto';

export const TestSignupDto: AuthDto = {
  email: 'alouismariea97@gmail.com',
  password: 'password',
  firstName: 'Henry',
  lastName: 'Newman',
  publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4txZR/FMsKbI9ZuwGCk/\nLhFJMfr589IiP0e7d5wk2ClK5C4xQ2W5G91SRPgW4tdvyjz63ILclzMQJy2TkocD\nxokZLte21pDceozEk5rCd7RpiOHNAx4pUPiAFN2AgqARDC/vsGFZQqNO9z9SHBTq\nRs41K9xAzpb9At3b3mJoIiUI7Cc8yunyRRfeyCK8sMAcX8f4dxe14o0v0+aC+hIU\noz9E726kT0fMTBZ5OxneWOevS/xhbMEeXaUUQbnLAWi2QMaGAtOGKESb1EQsSkSX\nC1vVnT4BUI6+ACAeKVvscfmNKDQYlO7GLK2yIXrNo7k1B2A1N4uH4iLxsxE7NqeS\nsQIDAQAB\n-----END PUBLIC KEY-----'
};

export const TestSigninDto: SigninDto = {
  email: 'test@email.com',
  password: 'password',
};
