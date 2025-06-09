import createError from 'http-errors';
import { newsletterQueue } from '../../queues/newsletter.queue';

export async function getUserNewsletterInfo(userId: string) {
  try {
    const repeatableJobs = await newsletterQueue.getRepeatableJobs();
    const userJob = repeatableJobs.find(
      (job) => job.id === `newsletter-recurring-${userId}`
    );

    if (!userJob) {
      return { hasNewsletter: false };
    }

    return {
      hasNewsletter: true,
      pattern: userJob.pattern,
      nextRun: userJob.next,
      jobId: userJob.id,
    };
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error(`Error getting newsletter info for user ${userId}:`, err);
    throw new createError.InternalServerError(
      `Error getting newsletter info for user ${userId}:` + (err as string)
    );
  }
}
