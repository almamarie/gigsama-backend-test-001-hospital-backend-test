import { User } from "@prisma/client";
import { FormattedUserType } from "../types";

export function formatUser(user: User): FormattedUserType {
  const formatted = {
    profiles: [],
    ...user,
    userId: user.userId,
    name: user.lastName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toString(),
    updatedAt: user.updatedAt.toString(),
  };

  delete formatted.passwordHash;
  delete formatted.passwordResetToken;
  delete formatted.passwordResetExpires;
  delete formatted.passwordChangedAt;

  return formatted;
}
