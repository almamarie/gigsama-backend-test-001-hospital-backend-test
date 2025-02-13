import { Roles } from "types";

export const permissions = {
  [Roles.DOCTOR]: [],

  [Roles.PATIENT]: [
    // user
    "get:own:user",
    "patch:own:user",
  ],
};
