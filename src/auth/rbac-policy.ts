import { RolesBuilder } from 'nest-access-control';
import { Roles } from 'types';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

// prettier-ignore
RBAC_POLICY.grant(Roles.USER)
  .readOwn('user')
  .readAny('user')
  .readOwn('form')
  .grant(Roles.ADMIN)
  .extend(Roles.USER)
