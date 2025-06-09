import { Weekday } from '../util/cronExpression';

export interface NewsletterJobData {
  userId: string;
  day: Weekday; // Día de la semana para el envío
  isInitialSend: boolean; // true para envío inmediato, false para recurrente
}
