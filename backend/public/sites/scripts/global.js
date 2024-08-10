import { configURL } from './globalUtils/config.js';
import { fetchWithAuth, checkTokenAndRedirect, checkUserRole } from './globalUtils/auth.js';
import { getCookies, getToken, getUserId, deleteCookie, setCookie, deleteAllCookies, deleteToken } from './globalUtils/cookies.js';
import { formatDate, getDateString } from './globalUtils/dateUtils.js';

export {
  configURL,
  fetchWithAuth,
  checkTokenAndRedirect,
  checkUserRole,
  getCookies,
  getToken,
  getUserId,
  deleteCookie,
  setCookie,
  deleteAllCookies,
  formatDate,
  getDateString,
  deleteToken,
};

// Exporting the functions globally (if needed)
window.configURL = configURL;
window.fetchWithAuth = fetchWithAuth;
window.checkTokenAndRedirect = checkTokenAndRedirect;
window.getCookies = getCookies;
window.getToken = getToken;
window.getUserId = getUserId;
window.deleteCookie = deleteCookie;
window.setCookie = setCookie;
window.deleteAllCookies = deleteAllCookies;
window.formatDate = formatDate;
window.getDateString = getDateString;
window.checkUserRole = checkUserRole;
window.deleteToken = deleteToken;
