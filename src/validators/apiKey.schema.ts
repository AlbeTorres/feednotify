import { z } from 'zod';

export const generateApiKeySchema = z.object({
  client_name: z.string().min(3),
  userId: z.string().uuid(),
  scopes: z.array(z.enum(['write', 'read'])).optional(),
});

export const getApiKeysByUserIdSchema = z.object({
  userId: z.string().uuid(),
});

export const deleteApiKeySchema = z.object({
  apiKeyId: z.string().uuid(),
});

export const updateApiKeySchema = z.object({
  apiKeyId: z.string().uuid(),
  status: z.boolean(),
  scopes: z.array(z.enum(['write', 'read'])).optional(),
});

export type DeleteApiKeySchemaType = z.infer<typeof deleteApiKeySchema>;

export type UpdateApiKeySchemaType = z.infer<typeof updateApiKeySchema>;

export type GetApiKeysByUserIdSchemaType = z.infer<
  typeof getApiKeysByUserIdSchema
>;
export type GenerateApiKeySchemaType = z.infer<typeof generateApiKeySchema>;
