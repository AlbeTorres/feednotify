import { z } from 'zod';

export const CreateSourceSchema = z
  .object({
    name: z.string().min(3),
    type: z.string(),
    url: z.string().url(),
    userId: z.string().uuid(),
  })
  .strict(); // This avoid sending invalid fields

export const CreateBulkSourceSchema = z
  .object({
    name: z.string().min(3),
    type: z.string(),
    category: z.string().optional(),
    url: z.string().url(),
  })
  .strict(); // This avoid sending invalid fields

export const CreateBulkSourceArraySchema = z.array(CreateBulkSourceSchema);

export const UpdateSourceSchema = z
  .object({
    sourceId: z.string().uuid(),
    name: z.string().min(3),
    type: z.string(),
    url: z.string().url(),
    userId: z.string().uuid(),
  })
  .strict(); // This avoid sending invalid fields

export const DeleteSourceSchema = z
  .object({
    sourceId: z.string().uuid(),
    userId: z.string().uuid(),
  })
  .strict(); // This avoid sending invalid fields

export const GetSourcesByUserSchema = z
  .object({
    userId: z.string().uuid(),
  })
  .strict(); // This avoid sending invalid fields

export const GetSourceByIdSchema = z
  .object({
    sourceId: z.string().uuid(),
    userId: z.string().uuid(),
  })
  .strict();

export type GetSourceByIdSchemaType = z.infer<typeof GetSourceByIdSchema>;

export type GetSourcesByUserSchemaType = z.infer<typeof GetSourcesByUserSchema>;

export type UpdateSourceSchemaType = z.infer<typeof UpdateSourceSchema>;

export type DeleteSourceSchemaType = z.infer<typeof DeleteSourceSchema>;

export type CreateSourceSchemaType = z.infer<typeof CreateSourceSchema>;
export type CreateBulkSourceSchemaType = z.infer<typeof CreateBulkSourceSchema>;
