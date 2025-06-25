import { Weekday } from '../util/cronExpression';

export interface NewsletterJobData {
  newsletterId: string; // ID de la newsletter
  userId: string;
  weekday: Weekday; // Día de la semana para el envío
  isInitialSend: boolean; // true para envío inmediato, false para recurrente
}
