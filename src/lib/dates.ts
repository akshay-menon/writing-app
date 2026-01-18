/**
 * Get the most recent Saturday (start of the current fiction prompt week).
 * If today is Saturday, returns today.
 */
export function getCurrentWeekSaturday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

  // Calculate days since last Saturday
  const daysSinceSaturday = dayOfWeek === 6 ? 0 : (dayOfWeek + 1);

  const saturday = new Date(today);
  saturday.setDate(today.getDate() - daysSinceSaturday);
  saturday.setHours(0, 0, 0, 0);

  return saturday;
}

/**
 * Get days remaining until next Saturday (when a new fiction prompt arrives).
 * On Saturday, returns 7 (full week for the new prompt).
 */
export function getDaysUntilNextSaturday(): number {
  const today = new Date();
  const dayOfWeek = today.getDay();

  if (dayOfWeek === 6) return 7; // It's Saturday
  return dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
}

/**
 * Format a date as YYYY-MM-DD for database queries.
 */
export function formatDateForDB(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date at midnight (for daily prompt lookups).
 */
export function getTodayDate(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
