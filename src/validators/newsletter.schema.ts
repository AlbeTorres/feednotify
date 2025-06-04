import { z } from 'zod';
export const WeeklyNewsletterSchema = z
  .object({
    day: z.enum([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]),
  })
  .strict();

export type WeeklyNewsletterSchemaType = z.infer<typeof WeeklyNewsletterSchema>;
