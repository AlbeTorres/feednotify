import { z } from 'zod';
export const WeeklyNewsletterSchema = z
  .object({
    weekday: z.enum([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]),
    newsletterId: z.string().uuid(),
    hour: z.number().min(0).max(23).optional(),
    minute: z.number().min(0).max(59).optional(),
  })
  .strict();

export const NewsletterSchema = z
  .object({
    newsletterId: z.string().uuid(),
    userId: z.string().uuid(),
  })
  .strict();

export const CreateNewsletterSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(3),
  category: z.string(),
  sources: z.array(z.string().uuid()),
});

export const UpdateNewsletterSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  category: z.string(),
  userId: z.string().uuid(),
});
export const UpdateSourceNewsletterSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  sources: z.array(z.string().uuid()),
});

export const DeleteNewsletterSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});

export const GetNewsletterByUserSchema = z.object({
  userId: z.string().uuid(),
});

export const GetNewsletterByIdSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});

export type GetNewsletterByIdSchemaType = z.infer<
  typeof GetNewsletterByIdSchema
>;

export type GetNewsletterByUserSchemaType = z.infer<
  typeof GetNewsletterByUserSchema
>;
export type DeleteNewsletterSchemaType = z.infer<typeof DeleteNewsletterSchema>;
export type CreateNewsletterSchemaType = z.infer<typeof CreateNewsletterSchema>;
export type UpdateNewsletterSchemaType = z.infer<typeof UpdateNewsletterSchema>;
export type UpdateSourceNewsletterSchemaType = z.infer<
  typeof UpdateSourceNewsletterSchema
>;
export type WeeklyNewsletterSchemaType = z.infer<typeof WeeklyNewsletterSchema>;
