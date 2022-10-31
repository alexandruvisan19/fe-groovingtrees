import { formatInTimeZone } from 'date-fns-tz';

/**
 * formatDate
 */

export function formatDate(date) {
  return formatInTimeZone(new Date(date), 'America/New_York', 'yyyy-MM-dd');
}

/**
 * sortObjectsByDate
 */

export function sortObjectsByDate(array, { key = 'date' } = {}) {
  return array.sort((a, b) => new Date(b[key]) - new Date(a[key]));
}
