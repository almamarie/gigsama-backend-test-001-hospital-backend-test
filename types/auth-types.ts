export type GeneralResponseType = {
  status: boolean;
  message: string;
  data: object;
};

export type welcomeEmailType = {
  name: string;
  activationUrl: string;
};

export type FormattedUserType = {
  userId: string;
  name: string;
  email: string;
  role: string;

  createdAt: string;
  updatedAt: string;
};
