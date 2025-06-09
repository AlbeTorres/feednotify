import { Queue } from 'bullmq';
import connection from '../config/redis';
import { NewsletterJobData } from '../interfaces/newsletterJobData';

// Crear la cola
export const newsletterQueue = new Queue<NewsletterJobData>('newsletter', {
  connection,
});
