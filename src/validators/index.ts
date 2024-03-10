import zod from "zod";
import { Role } from "@prisma/client";

export const LoginValidator = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
  code: zod.optional(zod.string()),
});

export const RegisterRequestValidator = zod.object({
  name: zod.string().min(3),
  email: zod.string().email(),
  password: zod.string().min(8),
});

export const PasswordResetRequestValidator = zod.object({
  email: zod.string().email(),
});

export const PasswordResetValidator = zod.object({
  password: zod.string().min(8),
});

export const UpdateProfileValidator = zod
  .object({
    name: zod.optional(zod.string().min(3)),
    email: zod.optional(zod.string().email()),
    password: zod.optional(zod.string().min(8)),
    newPassword: zod.optional(zod.string().min(8)),
    role: zod.enum([Role.ADMIN, Role.USER]),
    isTwoFactorEnabled: zod.optional(zod.boolean()),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  );
