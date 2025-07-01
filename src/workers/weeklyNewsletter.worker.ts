import { Job, Worker } from 'bullmq';
import connection from '../config/redis';

import { sendNewsletterService } from '../services/newsletterDelivery/sendNewsletter.service';
import { NewsletterJobData } from '../Interfaces/newsletterJobData';

export const newsletterWorker = new Worker<NewsletterJobData>(
  'newsletter',
  async (job: Job<NewsletterJobData>) => {
    const { userId, weekday, isInitialSend, newsletterId } = job.data;

    console.log(
      `📧 Processing newsletter for user ${userId} (${isInitialSend ? 'immediate' : 'scheduled'})`
    );
    console.log(`${weekday} `);

    try {
      // Optener la info del user por su id
      // Optener las sources de la base de datos
      // Leer RSS y YouTube con fecha actual
      // Crear contenido de newsletter
      // Enviar el correo

      const currentDate = new Date();
      const lastWeek = new Date();
      // Restar 7 días para obtener la fecha de hace una semana
      lastWeek.setDate(lastWeek.getDate() - 7);

      await sendNewsletterService(userId, newsletterId, lastWeek);

      console.log(`✅ Newsletter sent successfully to userEmail`);

      return {
        success: true,
        sentAt: currentDate.toISOString(),
        // itemCount: rssFeed.length + youtubeFeed.length,
      };
    } catch (error) {
      console.error(`❌ Failed to send newsletter to ${userId}:`, error);
      throw error; // BullMQ manejará los reintentos
    }
  },
  {
    connection: connection,
    concurrency: 5, // Procesar hasta 5 newsletters simultáneamente
    removeOnComplete: { count: 100 }, // Mantener últimos 100 jobs completados
    removeOnFail: { count: 50 }, // Mantener últimos 50 jobs fallidos
  }
);

// Event listeners para logging
newsletterWorker.on('completed', (job) => {
  console.log(`🎉 Job ${job.id} completed for user ${job.data.userId}`);
});

newsletterWorker.on('failed', (job, err) => {
  console.log(
    `💥 Job ${job?.id} failed for user ${job?.data.userId}: ${err.message}`
  );
});
