import { z } from 'zod';

export const CreateSourceSchema = z
  .object({
    name: z.string().min(3),
    type: z.string(),
    url: z.string().url(),
  })
  .strict(); // Para evitar que se envíen campos no válidos

export const UpdateSourceSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(3),
    type: z.string(),
    url: z.string().url(),
  })
  .strict(); // Para evitar que se envíen campos no válidos

export type UpdateSourceSchemaType = z.infer<typeof UpdateSourceSchema>;

export type CreateSourceSchemaType = z.infer<typeof CreateSourceSchema>;
