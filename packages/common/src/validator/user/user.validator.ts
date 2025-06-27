import { z } from 'zod';

export const usernameSchema = z
  .string()
  .min(4, { message: "Username must be at least 4 characters long" })
  .max(20, { message: "Username must be at most 20 characters long" })
  .regex(/^[a-z0-9._]+$/, {
    message: "Username can only contain lowercase letters, numbers, dots and underscores",
  })
  .refine((val) => !/^[._]/.test(val), {
    message: "Username cannot start with a dot or underscore",
  })
  .refine((val) => !/[._]$/.test(val), {
    message: "Username cannot end with a dot or underscore",
  })
  .refine((val) => !/(\.\.|__|_\.)|(\._)/.test(val), {
    message: "Username cannot have consecutive dots or underscores",
  });

export const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });

export const emailSchema = z.string().email({ message: "Invalid email address" });
  
export const fullNameSchema = z
.string()
.min(2, { message: "FullName must be at least 2 character long"})
.max(40, { message: "FullName must be at most 40 character long"})
  
export const bioSchema = z.string()
  .max(250, 'Bio cannot exceed 250 characters.')
  .optional();
export const deviceSchema = z.object({
  type: z.string().optional(),
  os: z.string().optional(),
  browser: z.string().optional(),
  resolution: z.string().optional(),
  language: z.string().optional(),
  timezeone: z.string().optional(),
  useragent: z.string().optional(),
  token: z.string().optional(),
})

export const publicKeySchema = z.string().min(1, {message: "public key to encrypt private key can't be empty"})
export const registerUserSchema = z
.object({
  email: emailSchema,
  fullName: fullNameSchema,
  username: usernameSchema,
    password: passwordSchema,
    repeatPassword: z.string(),
    device: z.array(deviceSchema).optional(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"], // set error on repeatPassword field
  });
  
  export const loginUserSchema = z.object({
    userEmail: z.string().min(1, {message: "Username or Email is required"}),
    password: z.string().min(1, {message: "Password is missing"}),
    device: z.array(deviceSchema).optional(),
  })
  
  export const updatePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordSchema,
    repeatPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"], // set error on repeatPassword field
  });
  
  export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"], // set error on repeatPassword field
  });
  
  export type UsernameSchema = z.infer<typeof usernameSchema>;
  export type Password = z.infer<typeof passwordSchema>;
  export type EmailSchema = z.infer<typeof emailSchema>;
  export type FullNameSchema = z.infer<typeof fullNameSchema>;
  export type BioSchema = z.infer<typeof bioSchema>;
  export type DeviceSchema = z.infer<typeof deviceSchema>;
  export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
  export type LoginUserSchema = z.infer<typeof loginUserSchema>;
  export type PublicKeySchema = z.infer<typeof publicKeySchema>;
  export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>
  export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema >
