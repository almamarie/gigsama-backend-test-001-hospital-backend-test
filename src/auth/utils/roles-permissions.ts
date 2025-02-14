import { Roles } from "types";

export const permissions = {
  [Roles.DOCTOR]: ['get:own:user', 'get:doctor:patients', 'post:patient:notes'],

  [Roles.PATIENT]: [
    // user
    'get:own:user',
    'patch:own:user',
    'post:assign:doctor',
    'get:note:patient'
  ]
};
