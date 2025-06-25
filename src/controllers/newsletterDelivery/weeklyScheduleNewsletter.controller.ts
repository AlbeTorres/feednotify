import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { newsletterQueue } from '../../queues/newsletter.queue';
import { cronExpression } from '../../util/cronExpression';
import { WeeklyNewsletterSchema } from '../../validators/newsletter.schema';

export async function weeklyScheduleNewsletter(req: Request, res: Response) {
  const { weekday, hour, minute, newsletterId } = req.body;

  const validatedFields = WeeklyNewsletterSchema.safeParse({
    weekday,
    newsletterId,
    hour,
    minute,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid Input data');
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  try {
    const recurringDay = cronExpression(minute, hour, weekday);

    const recurringJob = await newsletterQueue.add(
      `recurring-${userId}`,
      {
        userId,
        weekday,
        isInitialSend: false,
        newsletterId: newsletterId, // Aquí deberías pasar el ID de la newsletter si es necesario
      },
      {
        repeat: {
          pattern: recurringDay,
        },
        jobId: `newsletter-recurring-${userId}`, // ID único para poder cancelar
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    );

    const response = {
      success: true,
      recurringJobId: recurringJob.id,
      message: `Newsletter configured: weekly on ${weekday}s`,
    };

    res.json(response);
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    if (err instanceof z.ZodError) {
      throw new createError.BadRequest(
        'Internal valiadation error: ' + err.message
      );
    }

    console.error('[Weekly newsletter Error]', err);
    throw new createError.InternalServerError(
      'Unespected error scheduling the newsletter: ' + (err as string)
    );
  }
}
