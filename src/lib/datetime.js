import dateFormat from 'dateformat';

/**
 * formatDate
 */

export function formatDate(date) {
  return dateFormat(new Date(date), 'mmm dS, yyyy');
}

/**
 * sortObjectsByDate
 */

export function sortObjectsByDate(array, { key = 'date' } = {}) {
  return array.sort((a, b) => new Date(b[key]) - new Date(a[key]));
}
