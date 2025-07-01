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

export function cronExpression(
  minute: number = 0,
  hour: number = 0,
  day: Weekday = 'Monday'
) {
  return `${minute} ${hour} * * ${WEEKDAYS[day]}`; // Cron expression for 00:00 on the specified weekday
}
