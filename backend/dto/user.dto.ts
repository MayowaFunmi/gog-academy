import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters long"),
  // matricNumber: z.string().optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  gender: z.enum(["Male", "Female"]),
  email: z.string().email("Invalid email address"),
  role: z.string().min(2, "Role must not be empty"),
  phoneNumber: z.string().min(10).regex(/^\d+$/, "Phone number must be a at least 10 valid numbers"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

export const userLoginSchema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

export type UserRegistrationDto = z.infer<typeof userRegistrationSchema>;
export type UserLoginDto = z.infer<typeof userLoginSchema>;