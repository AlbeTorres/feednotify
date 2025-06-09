import createError from 'http-errors';
import { newsletterQueue } from '../../queues/newsletter.queue';

export async function cancelUserNewsletter(userId: string) {
  try {
    // Buscar y cancelar job recurrente existente
    const repeatableJobs = await newsletterQueue.getJobSchedulers();
    for (const job of repeatableJobs) {
      // Verificar si el job pertenece al usuario (tanto por name como por data)
      if (
        job.name === `recurring-${userId}` ||
        (job.template?.data && job.template.data.userId === userId)
      ) {
        await newsletterQueue.removeJobScheduler(job.key);
        console.log(
          `🗑️ Cancelled recurring newsletter scheduler ${job.key} for user ${userId}`
        );
        console.log(`   - Name: ${job.name}, Pattern: ${job.pattern}`);
      }
    }

    // Cancelar jobs pendientes que NO pertenecen a un scheduler
    const waitingJobs = await newsletterQueue.getJobs(['waiting', 'delayed']);
    for (const job of waitingJobs) {
      if (job.data.userId === userId && !job.data.isInitialSend) {
        // Verificar si el job pertenece a un scheduler
        if (!job.repeatJobKey) {
          // Solo remover jobs que no son parte de un scheduler
          await job.remove();
          console.log(`🗑️ Removed pending job ${job.id} for user ${userId}`);
        } else {
          console.log(
            `⚠️ Skipped scheduler-managed job ${job.id} for user ${userId}`
          );
        }
      }
    }

    // Alternativamente, puedes usar obliterate para forzar la eliminación
    // CUIDADO: Esto eliminará TODOS los jobs relacionados con este patrón
    /*
    try {
      const obliterateCount = await newsletterQueue.obliterate({
        pattern: `*${userId}*`,
        force: true
      });
      console.log(`🗑️ Obliterated ${obliterateCount} jobs for user ${userId}`);
    } catch (obliterateErr) {
      console.warn(`Could not obliterate jobs for user ${userId}:`, obliterateErr);
    }
    */
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }
    console.error(`Error cancelling newsletter for user ${userId}:`, err);
    throw new createError.InternalServerError(
      `Error cancelling newsletter for user ${userId}: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
// import createError from 'http-errors';
// import { newsletterQueue } from '../../queues/newsletter.queue';

// export async function cancelUserNewsletter(userId: string) {
//   try {
//     // Buscar y cancelar job recurrente existente
//     const repeatableJobs = await newsletterQueue.getJobSchedulers();

//     for (const job of repeatableJobs) {
//       if (job.id === `newsletter-recurring-${userId}`) {
//         await newsletterQueue.removeJobScheduler(job.key);
//         console.log(`🗑️ Cancelled recurring newsletter for user ${userId}`);
//       }
//     }

//     // También cancelar jobs pendientes
//     const waitingJobs = await newsletterQueue.getJobs(['waiting', 'delayed']);
//     for (const job of waitingJobs) {
//       if (job.data.userId === userId && !job.data.isInitialSend) {
//         await job.remove();
//       }
//     }
//   } catch (err: unknown) {
//     if (err instanceof createError.HttpError) {
//       throw err;
//     }

//     console.error(`Error cancelling newsletter for user ${userId}:`, err);
//     throw new createError.InternalServerError(
//       `Error cancelling newsletter for user ${userId}:` + (err as string)
//     );
//   }
// }
