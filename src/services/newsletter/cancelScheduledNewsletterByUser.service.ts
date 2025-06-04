import createError from 'http-errors';
import { newsletterQueue } from '../../queues/newsletter.queue';

export async function cancelUserNewsletter(userId: string) {
  try {
    // Buscar y cancelar job recurrente existente
    const repeatableJobs = await newsletterQueue.getJobSchedulers();

    for (const job of repeatableJobs) {
      if (job.id === `newsletter-recurring-${userId}`) {
        await newsletterQueue.removeJobScheduler(job.key);
        console.log(`🗑️ Cancelled recurring newsletter for user ${userId}`);
      }
    }

    // También cancelar jobs pendientes
    const waitingJobs = await newsletterQueue.getJobs(['waiting', 'delayed']);
    for (const job of waitingJobs) {
      if (job.data.userId === userId && !job.data.isInitialSend) {
        await job.remove();
      }
    }
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error(`Error cancelling newsletter for user ${userId}:`, err);
    throw new createError.InternalServerError(
      `Error cancelling newsletter for user ${userId}:` + (err as string)
    );
  }
}
