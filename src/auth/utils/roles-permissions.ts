import { Roles } from "types";

export const permissions = {
  [Roles.DOCTOR]: ['get:own:user'],

  [Roles.PATIENT]: [
    // user
    'get:own:user',
    'patch:own:user',
    'post:assign:doctor'
  ]
};
