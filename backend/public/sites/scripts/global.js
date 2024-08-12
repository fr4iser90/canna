import { formatDate, getDateString } from './globalUtils/dateUtils.js';

export {
  formatDate,
  getDateString,
};

export function fetchWithCookies(url, options = {}) {
  // Standardoptionen setzen
  const defaultOptions = {
    credentials: 'include', // Cookies werden mitgesendet
  };

  // Benutzerdefinierte Optionen mit Standardoptionen zusammenführen
  const mergedOptions = { ...defaultOptions, ...options };

  // Fetch ausführen
  return fetch(url, mergedOptions);
}

// Exporting the functions globally (if needed)
window.formatDate = formatDate;
window.getDateString = getDateString;
window.fetchWithCookies = fetchWithCookies; // Optional
