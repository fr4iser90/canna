import { configURL } from './globalUtils/config.js';
import { formatDate, getDateString } from './globalUtils/dateUtils.js';

export {
  configURL,
  formatDate,
  getDateString,
};

// Exporting the functions globally (if needed)
window.configURL = configURL;
window.formatDate = formatDate;
window.getDateString = getDateString;
