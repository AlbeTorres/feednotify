// dto/auth.dto.ts (puedes renombrar a auth.schema.ts si prefieres)
import { z } from 'zod';

export const LoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    code: z.string().optional(),
  })
  .strict(); // Para evitar que se envíen campos no válidos

export const RegisterSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['admin', 'user']).optional(),
  })
  .strict(); // Para evitar que se envíen campos no válidos

export const EmailVerificationSchema = z
  .object({
    token: z.string(),
  })
  .strict(); // Para evitar que se envíen campos no válidos

export type EmailVerificationSchemaType = z.infer<
  typeof EmailVerificationSchema
>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
