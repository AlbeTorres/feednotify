// ============= CONFIGURACIÓN DE BULLMQ =============
// config/redis.ts

// ============= QUEUE Y WORKER SETUP =============
// services/newsletterQueue.ts
import { Job, Queue, Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { SourceFeedItem } from '../interfaces';
import { sendNewsletterEmail } from '../util/emailSender'; // Tu función de envío
import { readRssFeeds } from '../util/readers/rssreader';
import { readYoutubeFeeds } from '../util/readers/youtubeReader';

// Tipos para los jobs
interface NewsletterJobData {
  userId: string;
  userEmail: string;
  sources: SourceFeedItem[];
  day: string;
  isInitialSend: boolean; // true para envío inmediato, false para recurrente
}

// Crear la cola
export const newsletterQueue = new Queue<NewsletterJobData>(
  'newsletter',
  redisConnection
);

// Crear el worker que procesa los jobs
const newsletterWorker = new Worker<NewsletterJobData>(
  'newsletter',
  async (job: Job<NewsletterJobData>) => {
    const { userId, userEmail, sources, day, isInitialSend } = job.data;

    console.log(
      `📧 Processing newsletter for user ${userId} (${isInitialSend ? 'immediate' : 'scheduled'})`
    );

    try {
      // 1. Leer RSS y YouTube con fecha actual
      const currentDate = new Date();
      const rssFeed = await readRssFeeds(sources, currentDate);
      const youtubeFeed = await readYoutubeFeeds(sources, currentDate);

      // 2. Crear contenido de newsletter
      const newsletterContent = {
        rssFeed,
        youtubeFeed,
        day,
        generatedAt: currentDate.toISOString(),
        isInitialSend,
      };

      // 3. Enviar el correo
      await sendNewsletterEmail(userEmail, newsletterContent);

      console.log(`✅ Newsletter sent successfully to ${userEmail}`);

      return {
        success: true,
        sentAt: currentDate.toISOString(),
        itemCount: rssFeed.length + youtubeFeed.length,
      };
    } catch (error) {
      console.error(`❌ Failed to send newsletter to ${userId}:`, error);
      throw error; // BullMQ manejará los reintentos
    }
  },
  {
    connection: redisConnection.connection,
    concurrency: 5, // Procesar hasta 5 newsletters simultáneamente
    removeOnComplete: 100, // Mantener últimos 100 jobs completados
    removeOnFail: 50, // Mantener últimos 50 jobs fallidos
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

// ============= FUNCIONES PRINCIPALES =============
// services/newsletterService.ts

const WEEKDAYS = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

type Weekday = keyof typeof WEEKDAYS;

/**
 * Función principal que maneja newsletter inmediata + programación semanal
 */
export async function scheduleWeeklyNewsletter(
  userId: string,
  userEmail: string,
  sources: SourceFeedItem[],
  day: Weekday = 'Monday'
) {
  try {
    console.log(`📅 Setting up newsletter for user ${userId} on ${day}s`);

    // 1. ENVÍO INMEDIATO
    // Agregar job para envío inmediato (sin delay)
    const immediateJob = await newsletterQueue.add(
      `immediate-${userId}`,
      {
        userId,
        userEmail,
        sources,
        day,
        isInitialSend: true,
      },
      {
        priority: 10, // Alta prioridad para envío inmediato
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );

    // 2. CANCELAR PROGRAMACIÓN PREVIA (si existe)
    await cancelUserNewsletter(userId);

    // 3. PROGRAMACIÓN SEMANAL RECURRENTE
    // Crear expresión cron para el día elegido
    const cronExpression = `0 0 * * ${WEEKDAYS[day]}`; // Cada [día] a las 00:00

    const recurringJob = await newsletterQueue.add(
      `recurring-${userId}`,
      {
        userId,
        userEmail,
        sources,
        day,
        isInitialSend: false,
      },
      {
        repeat: {
          pattern: cronExpression,
        },
        jobId: `newsletter-recurring-${userId}`, // ID único para poder cancelar
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    );

    return {
      success: true,
      immediateJobId: immediateJob.id,
      recurringJobId: recurringJob.id,
      day,
      cronExpression,
      message: `Newsletter configured: immediate send + weekly on ${day}s`,
    };
  } catch (error) {
    console.error('Error setting up newsletter:', error);
    throw new Error(`Failed to schedule newsletter: ${error}`);
  }
}

/**
 * Cancelar newsletter recurrente de un usuario
 */
export async function cancelUserNewsletter(userId: string) {
  try {
    // Buscar y cancelar job recurrente existente
    const repeatableJobs = await newsletterQueue.getRepeatableJobs();

    for (const job of repeatableJobs) {
      if (job.id === `newsletter-recurring-${userId}`) {
        await newsletterQueue.removeRepeatableByKey(job.key);
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
  } catch (error) {
    console.error(`Error cancelling newsletter for user ${userId}:`, error);
  }
}

/**
 * Obtener información de newsletters programadas
 */
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
  } catch (error) {
    console.error(`Error getting newsletter info for user ${userId}:`, error);
    return { hasNewsletter: false, error: error.message };
  }
}

// ============= ENDPOINT IMPLEMENTATION =============
// routes/newsletter.ts (ejemplo con Express)

import express from 'express';
import {
  cancelUserNewsletter,
  getUserNewsletterInfo,
  scheduleWeeklyNewsletter,
} from '../services/newsletterService';

const router = express.Router();

/**
 * POST /api/newsletter/schedule
 * Configurar newsletter para usuario
 */
router.post('/schedule', async (req, res) => {
  try {
    const { userId, userEmail, sources, day } = req.body;

    // Validaciones
    if (!userId || !userEmail || !sources || !Array.isArray(sources)) {
      return res.status(400).json({
        error: 'Missing required fields: userId, userEmail, sources',
      });
    }

    if (day && !Object.keys(WEEKDAYS).includes(day)) {
      return res.status(400).json({
        error:
          'Invalid day. Must be one of: ' + Object.keys(WEEKDAYS).join(', '),
      });
    }

    const result = await scheduleWeeklyNewsletter(
      userId,
      userEmail,
      sources,
      day
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Newsletter scheduling error:', error);
    res.status(500).json({
      error: 'Failed to schedule newsletter',
      details: error.message,
    });
  }
});

/**
 * DELETE /api/newsletter/:userId
 * Cancelar newsletter de usuario
 */
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    await cancelUserNewsletter(userId);

    res.json({
      success: true,
      message: `Newsletter cancelled for user ${userId}`,
    });
  } catch (error) {
    console.error('Newsletter cancellation error:', error);
    res.status(500).json({
      error: 'Failed to cancel newsletter',
    });
  }
});

/**
 * GET /api/newsletter/:userId/info
 * Obtener información de newsletter del usuario
 */
router.get('/:userId/info', async (req, res) => {
  try {
    const { userId } = req.params;
    const info = await getUserNewsletterInfo(userId);

    res.json({
      success: true,
      data: info,
    });
  } catch (error) {
    console.error('Newsletter info error:', error);
    res.status(500).json({
      error: 'Failed to get newsletter info',
    });
  }
});

export default router;

// ============= INSTALACIÓN Y USO =============
/*
1. Instalar dependencias:
npm install bullmq ioredis

2. Variables de entorno (.env):
REDIS_URL=your_upstash_redis_url

3. En tu app principal (app.ts):
import './services/newsletterQueue'; // Para inicializar el worker
import newsletterRoutes from './routes/newsletter';
app.use('/api/newsletter', newsletterRoutes);

4. Ejemplo de uso:
POST /api/newsletter/schedule
{
  "userId": "user123",
  "userEmail": "user@example.com", 
  "sources": [
    { "type": "rss", "url": "https://example.com/feed.xml" },
    { "type": "youtube", "channelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw" }
  ],
  "day": "Wednesday"
}

Esto hará:
- Envío inmediato de newsletter con contenido actual
- Programación para enviar cada miércoles a las 00:00
- Si el usuario ya tenía una programación, la cancela y crea una nueva
*/
