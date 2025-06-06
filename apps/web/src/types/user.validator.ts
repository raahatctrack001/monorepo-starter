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

  
  const bioSchema = z.string()
    .max(250, 'Bio cannot exceed 250 characters.')
    .optional();

export const registerUserSchema = z
  .object({
    email: emailSchema,
    fullName: fullNameSchema,
    username: usernameSchema,
    password: passwordSchema,
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"], // set error on repeatPassword field
  });

export const updateUserSchema = z.object({
  username: usernameSchema,
  fullName: fullNameSchema, 
  bio: bioSchema,
});

// export const uniqueIdValidator = (userEmail)=>{
//     const uniqueId = emailSchema.safeParse(userEmail);
//     let query = {};
//     if(uniqueId.success){
//         query = {
//             email: uniqueId.data,
//         }
//     }
//     else{
//         query = {
//             username: userEmail
//         }
//     }
//     return query;
// }