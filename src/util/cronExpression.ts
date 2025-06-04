const WEEKDAYS = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export type Weekday = keyof typeof WEEKDAYS;

export async function cronExpression(day: Weekday = 'Monday') {
  return `0 0 * * ${WEEKDAYS[day]}`; // Cron expression for 00:00 on the specified weekday
}
