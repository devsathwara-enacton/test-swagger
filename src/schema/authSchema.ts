import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .refine((email) => email.trim().length > 0, {
      message: "Email is required",
    }),
  password: z.string().refine((password) => password.length > 0, {
    message: "Password is required",
  }),
});

export const registerUserSchema = z.object({
  name: z.string().refine((name) => name.trim().length > 0, {
    message: "Name is required",
  }),
  email: z
    .string()
    .email("Invalid email format")
    .refine((email) => email.trim().length > 0, {
      message: "Email is required",
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine(
      (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password),
      {
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit",
      }
    ),
});
